import * as React from 'react';
import IAVisibleWarning from '../../../components/vsible_warning/IAVisibleWarning';
import { filedToCheckContainersInfo, filedToCheckContainersFail } from '../filed_to_check/filedToCheck';
import { Button, Glyphicon } from 'react-bootstrap';
import ContainerFormLazy from 'components/new/pages/inspection/container';
import ContainerRow from './container_row';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import inspectContainerActions from 'redux-main/reducers/modules/inspect/container/container_actions';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { CheckContainerTable } from 'components/new/pages/inspection/common_components/form_wrap_check/styled';
import { DivNone } from 'global-styled/global-styled';

type ContainerBlockStateProps = {};
type ContainerBlockDispatchProps = {
  actionGetInspectContainer: HandleThunkActionCreator<typeof inspectContainerActions.actionGetInspectContainer>;
  actionRemoveInspectContainer: HandleThunkActionCreator<typeof inspectContainerActions.actionRemoveInspectContainer>;
};
type ContainerBlockOwnProps = {
  selectedInspectPgmBase: InspectPgmBase;
  errors: any;
  isPermittedChangeListParams: boolean;
  onChangeData: (obj: any) => void;

  page: string;
};
type ContainerBlockMergedProps = (
  ContainerBlockStateProps
  & ContainerBlockDispatchProps
  & ContainerBlockOwnProps
);
type ContainerBlockProps = ContainerBlockMergedProps & WithSearchProps;

const ContainerBlock: React.FC<ContainerBlockProps> = (props) => {
  const [selectedContainer, setSelectedContainer] = React.useState(null);
  const [containerList, setContainerList] = React.useState([]);

  React.useEffect(
    () => {
      loadContainerList();
    },
    [props.selectedInspectPgmBase.id],
  );

  const loadContainerList = React.useCallback(
    () => {
      props.actionGetInspectContainer(
        props.selectedInspectPgmBase.id,
        { page: props.page },
      ).then((ans) => {
        setContainerList(ans.sort((a, b) => b.id - a.id));

        props.onChangeData({
          ...props.selectedInspectPgmBase.data,
          containers_counter: ans.length,
          summ_capacity: ans.reduce((summ, { capacity }) => summ + capacity, 0),
          pgm_volume_sum: ans.reduce((summ, { pgm_volume }) => summ + pgm_volume, 0),
        });
      });
    },
    [props.selectedInspectPgmBase],
  );

  const handleCreateContainer = React.useCallback(
    async () => {
      await setSelectedContainer({
        inspection_id: props.selectedInspectPgmBase.id,
      });
      loadContainerList();
    },
    [props.selectedInspectPgmBase.id],
  );

  const onEditContainer = React.useCallback(
    (container) => {
      setSelectedContainer(container);
    },
    [],
  );

  const onRemoveContainer = React.useCallback(
    async (container) => {
      try {
        await props.actionRemoveInspectContainer(
          container.id,
          { page: props.page },
        );
        loadContainerList();
        setSelectedContainer(null);
      } catch (error) {
        console.error(error); //tslint:disable-line
      }
    },
    [],
  );

  const handleFormHide = React.useCallback(
    (isSubmitted) => {
      if (isSubmitted) {
        loadContainerList();
      }

      setSelectedContainer(null);
    },
    [],
  );

  return (
    <React.Fragment>
      <h4>Готовность емкостей для хранения ПГМ</h4>
      <BoxContainer>
        <IAVisibleWarning
          onChange={props.onChangeData}
          data={props.selectedInspectPgmBase.data}
          errors={props.errors}
          isPermitted={props.isPermittedChangeListParams}
          filedToCheck={filedToCheckContainersInfo}
        />
      </BoxContainer>
      <BoxContainer>
        <h4>
          Выявленные нарушения
        </h4>
        <IAVisibleWarning
          onChange={props.onChangeData}
          data={props.selectedInspectPgmBase.data}
          errors={props.errors}
          isPermitted={props.isPermittedChangeListParams}
          filedToCheck={filedToCheckContainersFail}
        />
      </BoxContainer>
      <BoxContainer>
        <h4>
          Проверка емкостей
        </h4>
        <CheckContainerTable>
          {
            containerList.map((container) => (
              <ContainerRow
                key={container.id}
                container={container}
                onEditContainer={onEditContainer}
                onRemoveContainer={onRemoveContainer}
                isPermittedChangeListParams={props.isPermittedChangeListParams}
              />
            ))
          }
        </CheckContainerTable>
        {
          props.isPermittedChangeListParams
            ? (
              <Button disabled={!props.isPermittedChangeListParams} onClick={handleCreateContainer}>
                <Glyphicon glyph="plus"/>&nbsp;Добавить
              </Button>
            )
            : (
              <DivNone />
            )
        }
       <br />
      </BoxContainer>

      <ContainerFormLazy
        element={selectedContainer}
        onFormHide={handleFormHide}
        readOnly={!props.isPermittedChangeListParams}
      />
    </React.Fragment>
  );
};

export default compose<ContainerBlockProps, ContainerBlockOwnProps>(
  withSearch,
  connect<ContainerBlockStateProps, ContainerBlockDispatchProps, ContainerBlockOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetInspectContainer: (...arg) => (
        dispatch(
          inspectContainerActions.actionGetInspectContainer(...arg),
        )
      ),
      actionRemoveInspectContainer: (...arg) => (
        dispatch(
          inspectContainerActions.actionRemoveInspectContainer(...arg),
        )
      ),
    }),
  ),
)(ContainerBlock);
