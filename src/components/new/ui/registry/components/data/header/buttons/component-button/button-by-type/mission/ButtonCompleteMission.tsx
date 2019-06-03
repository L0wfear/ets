import * as React from 'react';
import { connect, DispatchProp, HandleThunkActionCreator } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registryLoadDataByKey, actionUnselectSelectedRowToShow } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import { get } from 'lodash';
import { actionCompleteMissionByIds } from 'redux-main/reducers/modules/missions/mission/actions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DivNone } from 'global-styled/global-styled';
import ChangeStatusRequesFormLazy from 'components/new/pages/edc_request/form/changeStatusRequesForm';

export type ButtonCompleteMissionStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  checkedRows: OneRegistryData['list']['data']['checkedRows'];
};
type ButtonCompleteMissionDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionCompleteMissionByIds: HandleThunkActionCreator<typeof actionCompleteMissionByIds>;
  actionUnselectSelectedRowToShow: HandleThunkActionCreator<typeof actionUnselectSelectedRowToShow>
};
type ButtonCompleteMissionOwnProps = {
  registryKey: string;
};
type ButtonCompleteMissionMergeProps = {};

type ButtonCompleteMissionProps = (
  ButtonCompleteMissionStateProps
  & ButtonCompleteMissionDispatchProps
  & ButtonCompleteMissionOwnProps
  & ButtonCompleteMissionMergeProps
);

const ButtonCompleteMission: React.FC<ButtonCompleteMissionProps> = (props) => {
  const [showChangeStatusRequesFormLazy, setShowChangeStatusRequesFormLazy] = React.useState(false);
  const [contentIndex, setContentIndex] = React.useState(0); // индекс, элемента в itemToRemove, который отображается в форме

  const [itemToRemove, setItemToRemove] = React.useState({});

  React.useEffect( () => {
    const itemToRemoveTmp = { ...props.checkedRows };
    if (!Object.values(itemToRemoveTmp).length) {
      itemToRemoveTmp[props.uniqKey] = props.selectedRow;
    }
    // console.log('itemToRemoveTmp === ', props.checkedRows);
    setItemToRemove(itemToRemoveTmp);
  }, [props.selectedRow, props.checkedRows] );

  const requestFormHide = React.useCallback(() => {
    const itemToRemoveLength = Object.values(itemToRemove).length;
    if (itemToRemoveLength && itemToRemoveLength > contentIndex) {
      setContentIndex(contentIndex + 1);
    } else {
      setShowChangeStatusRequesFormLazy(false);
    }
  }, []);

  const handleClickComplete = React.useCallback(
    async () => {
      try {
        // const response = await props.actionCompleteMissionByIds(Object.values(itemToRemove).map(({ [props.uniqKey]: id }) => id));
        setShowChangeStatusRequesFormLazy(true);
        // console.log('ButtonCompleteMission response === ', {response});
        // console.log('itemToRemove response === ', {itemToRemove});
      } catch (error) {
        console.error(error); // tslint:disable-line
        //
      }

      // props.actionUnselectSelectedRowToShow(props.registryKey, true); /// <<< подумать, куда это запихать, это сброс выжеденных строк
      props.registryLoadDataByKey(props.registryKey);
    },
    [props.selectedRow, props.checkedRows],
  );

  let disabled = false;

  const checkedRowsAsArray = Object.values(props.checkedRows);
  if (checkedRowsAsArray.length) {
    disabled = checkedRowsAsArray.some((mission: Mission) => !mission.can_be_closed);
  } else {
    const can_be_closed = get(props.selectedRow, 'can_be_closed', false);
    disabled = !can_be_closed;
  }
  disabled = false; // <<< удалить
  // console.log('ButtonCompleteMissionProps === ', {props, showChangeStatusRequesFormLazy});
  return (
    <>
      <EtsBootstrap.Button id="duty_mission-complete" bsSize="small" onClick={handleClickComplete} disabled={disabled}>
        <EtsBootstrap.Glyphicon glyph="ok" /> Выполнено
      </EtsBootstrap.Button>
      {
        showChangeStatusRequesFormLazy
          ? <ChangeStatusRequesFormLazy
              onFormHide={requestFormHide}
              checkedRows={props.checkedRows}
              itemToRemove={itemToRemove}
              contentIndex={contentIndex}
            />
          : <DivNone />
      }
    </>
  );
};

export default compose<ButtonCompleteMissionProps, ButtonCompleteMissionOwnProps>(
  connect<{ permissions: string | boolean }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonCompleteMissionStateProps, ButtonCompleteMissionDispatchProps, ButtonCompleteMissionOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
      checkedRows: getListData(state.registry, registryKey).data.checkedRows,
    }),
    (dispatch: any) => ({
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionCompleteMissionByIds: (...arg) => (
        dispatch(
          actionCompleteMissionByIds(...arg),
        )
      ),
      actionUnselectSelectedRowToShow: (...arg) => (
        dispatch(
          actionUnselectSelectedRowToShow(...arg),
        )
      ),
    }),
  ),
)(ButtonCompleteMission);
