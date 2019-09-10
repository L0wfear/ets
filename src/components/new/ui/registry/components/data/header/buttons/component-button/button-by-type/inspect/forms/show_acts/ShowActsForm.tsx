import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';
import { EtsHeaderContainer } from '../../../../../../styled/styled';
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
import ButtonRead from '../../../ButtonRead';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

type Props = {
  element: { id: number };
  handleHide: (...arg: any[]) => any;

  page: string;
  path: string;
};

const dataRemove: ValuesOf<OneRegistryData['header']['buttons']> = {
  type: buttonsTypes.remove,
  message_single: 'Вы уверены, что хотите удалить файл?',
  message_multi: 'Вы уверены, что хотите удалить файлы?',
};

const ShowActsForm: React.FC<Props> = React.memo(
  (props) => {
    const [element, changeElement] = React.useState(null);
    const {
      page, path,
    } = props;

    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(
          registryAddInitialData(getConfig(props.element.id)), // не сработает из других мест ЕТС
        );

        return () => {
          dispatch(
            registryRemoveData(registryKey),
          );
        };
      },
      [props.element.id],
    );

    const isPermittedUpdate = etsUseSelector(
      (state) => getSessionState(state).userData.permissionsSet.has(inspectActScanPermissions.update),
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
        changeElement({
          ...item,
          inspection_id: props.element.id,
        });
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
                  <ButtonRead registryKey={registryKey} onClick={handleOpenFormEdit} />
                  <ButtonRemove registryKey={registryKey} data={dataRemove} format="yesno"/>
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
