import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';
import { EtsHeaderContainer } from '../../../../../../styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import inspectActScanPermissions from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/registry/permissions';

import {
  getConfig,
  registryKey,
} from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/registry/registry-config';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { EtsButtonsContainer } from '../../../../../styled/styled';
import ButtonRemove from '../../../ButtonRemove';
import InspectActFileForm from './form/InspectActFileForm';
import ButtonReadWrap from '../../../wrap/ButtonReadWrap';

type Props = {
  element: { id: number };
  handleHide: (...arg: any[]) => any;

  page: string;
  path: string;
};

const ShowActsForm: React.FC<Props> = React.memo(
  (props) => {
    const [element, changeElement] = React.useState(null);
    const {
      page, path,
    } = props;

    const dispatch = useDispatch();

    React.useEffect(
      () => {
        dispatch(
          registryAddInitialData(getConfig(props.element.id)),
        );

        return () => {
          dispatch(
            registryRemoveData(registryKey),
          );
        };
      },
      [props.element.id],
    );

    const isPermittedUpdate = useSelector(
      (state: ReduxState) => getSessionState(state).userData.permissionsSet.has(inspectActScanPermissions.update),
    );

    const handleOpenForm = React.useCallback(
      () => {
        changeElement({
          inspection_id: props.element.id,
        });
      },
      [props.element.id],
    );

    const handleOpenFormEdit = React.useCallback(
      (item) => {
        changeElement(item);
      },
      [],
    );

    const handleHide = React.useCallback(
      (isSubmitted) => {
        changeElement(null);

        if (isSubmitted) {
          dispatch(
            registryLoadDataByKey(registryKey),
          );
        }
      },
      [],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.ModalContainer
          id="inspect_show_acts"
          show
          onHide={props.handleHide}
          bsSize="large"
        >
          <EtsBootstrap.ModalHeader closeButton>
            <EtsBootstrap.ModalTitle>Скан-копии актов проверки</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>
          <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
            <EtsBootstrap.Row>
              <EtsHeaderContainer>
                <EtsBootstrap.Button disabled={!isPermittedUpdate} onClick={handleOpenForm}>
                  Добавить файл
                </EtsBootstrap.Button>
                <EtsButtonsContainer>
                  <ButtonReadWrap registryKey={registryKey} onClick={handleOpenFormEdit} />
                  <ButtonRemove registryKey={registryKey} format="yesno"/>
                </EtsButtonsContainer>
              </EtsHeaderContainer>
              <TableData registryKey={registryKey} />
              <Paginator registryKey={registryKey} />
            </EtsBootstrap.Row>
          </ModalBodyPreloader>
          <EtsBootstrap.ModalFooter>
            <EtsBootstrap.Button onClick={props.handleHide}>
              Закрыть
            </EtsBootstrap.Button>
          </EtsBootstrap.ModalFooter>
        </EtsBootstrap.ModalContainer>
        {
          element && (
            <InspectActFileForm
              page={registryKey}
              path={path}

              element={element}
              handleHide={handleHide}
            />
          )
        }
      </React.Fragment>
    );
  },
);

export default ShowActsForm;
