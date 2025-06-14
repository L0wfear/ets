import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import TableData from 'components/new/ui/registry/components/data/table-data/TableData';
import Paginator from 'components/new/ui/registry/components/data/paginator/Paginator';
import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import inspectActScanPermissions from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/registry/permissions';

import {
  getConfig,
  registryKey,
} from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/registry/registry-config';
import { registryAddInitialData, registryRemoveData, registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import ButtonRemove from '../../../ButtonRemove';
import ButtonRead from '../../../ButtonRead';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { actionUpdateInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { actionUpdateInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import { actionUpdateInspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import { InspectAutobaseService, InspectCarsConditionService, InspectPgmBaseService } from 'api/Services';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

const InspectActFileFormContext = React.lazy(() => (
  import(/* webpackChunkName: "services" */ 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/form/InspectActFileFormContext')
));

type OwnProps = {
  element: { id: number; };
  handleHide: (...arg: Array<any>) => any;

  page: string;
  path: string;
};
type Props = OwnProps & WithSearchProps;

const dataRemove: ValuesOf<OneRegistryData['header']['buttons']> = {
  id: 'button_remove_file',
  type: buttonsTypes.remove,
  message_single: 'Вы уверены, что хотите удалить файл?',
  message_multi: 'Вы уверены, что хотите удалить файлы?',
  format: 'yesno',
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
        const registryService = props.match.url.includes('/autobase')
          ? InspectAutobaseService
          : props.match.url.includes('/pgm_base')
            ? InspectPgmBaseService
            : props.match.url.includes('/cars_condition')
              ? InspectCarsConditionService
              : null;

        dispatch(
          registryAddInitialData(getConfig(props.element.id, props.path, registryService)), // не сработает из других мест ЕТС
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
    const isPermittedDelete = etsUseSelector(
      (state) => getSessionState(state).userData.permissionsSet.has(inspectActScanPermissions.delete),
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

    const handleClickRemoveFile = React.useCallback(
      (selectedRow: InspectOneActScan) => {
        const [file] = selectedRow.files;
        const newFiles = selectedRow.inspection.files.map(
          (rowData) => {
            if (rowData.id === file.id) {
              return {
                ...rowData,
                action: 'delete',
              };
            }

            return rowData;
          },
        );

        if (selectedRow.inspection.type === 'autobase') {
          return dispatch(
            actionUpdateInspectAutobase(
              {
                ...selectedRow.inspection,
                files: newFiles,
                action: 'save',
              },
              props,
            ),
          );
        }
        if (selectedRow.inspection.type === 'pgm_base') {
          return dispatch(
            actionUpdateInspectPgmBase(
              {
                ...selectedRow.inspection,
                files: newFiles,
                action: 'save',
              },
              props,
            ),
          );
        }
        if (selectedRow.inspection.type === 'cars_condition') {
          return dispatch(
            actionUpdateInspectCarsCondition(
              {
                ...selectedRow.inspection,
                files: newFiles,
                action: 'save',
              },
              props,
            ),
          );
        }
      },
      [props.element.id],
    );

    const handleHide = React.useCallback(
      (isSubmitted, result?: any) => {
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
              <EtsHeaderContainerWrap>
                <EtsHeaderContainer>
                  <EtsBootstrap.Button disabled={!isPermittedUpdate} onClick={handleOpenForm}>
                    Добавить файл
                  </EtsBootstrap.Button>
                  <EtsButtonsContainer>
                    <ButtonRead registryKey={registryKey} onClick={handleOpenFormEdit} />
                    <ButtonRemove registryKey={registryKey} disabled={!isPermittedDelete} data={dataRemove} onClick={handleClickRemoveFile} />
                  </EtsButtonsContainer>
                </EtsHeaderContainer>
              </EtsHeaderContainerWrap>
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
          Boolean(element) && (
            <InspectActFileFormContext
              registryKey={registryKey}
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

export default withSearch<OwnProps>(ShowActsForm);
