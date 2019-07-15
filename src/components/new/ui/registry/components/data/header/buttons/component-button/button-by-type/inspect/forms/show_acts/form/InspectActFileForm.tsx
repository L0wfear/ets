import * as React from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ExtField } from 'components/ui/new/field/ExtField';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { actionLoadActFileData, actionPostActFileData, actionPutActFileData } from 'redux-main/reducers/modules/inspect/act_scan/inspect_act_scan_actions';
import { PropsInspectActFileForm, OwnInspectActFileFormProps, PropsInspectActFileFormWithForm } from './@types/InspectActFileForm';
import inspectActScanPermissions from '../registry/permissions';
import { getDefaultInspectActFileElement } from './utils';
import { inspectActFileFormSchema } from './schema';
import { FileField } from 'components/ui/input/fields';

const InspectActFileForm: React.FC<PropsInspectActFileForm> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      isPermitted,
      IS_CREATING,
    } = props;

    const handleChangeFile = React.useCallback(
      (newFiles) => {
        const action = get(newFiles, '0.action', '');

        if (action === 'delete') {
          props.handleChange({
            name: null,
            base64: null,
          });
        } else {
          props.handleChange({
            name: get(newFiles, '0.name', ''),
            base64: get(newFiles, '0.base64', ''),
          });
        }
      },
      [props.handleChange],
    );

    const files = React.useMemo(
      () => {
        if (state.name && (state.base64 || state.url)) {
          return [
            {
              name: state.name,
              base64: state.base64,
              url: state.url,
            },
          ];
        }
        return [];
      },
      [state.name, state.base64, state.url],
    );

    return (
      <EtsBootstrap.ModalContainer id="modal-inspect-act-file" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Загрузка файла</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                id="inspect_act_file_data"
                modalKey={path}
                label="Файл"
                value={files}
                error={errors.name}
                onChange={handleChangeFile}
                disabled={!isPermitted || !IS_CREATING}
              />
              <ExtField
                type="string"
                label="Примечание"
                value={state.notes}
                error={errors.notes}
                onChange={props.handleChange}
                boundKeys="notes"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted && (
              <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
            )
          }
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>Отмена</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsInspectActFileForm, OwnInspectActFileFormProps>(
  withForm<PropsInspectActFileFormWithForm, InspectOneActScan>({
    uniqField: 'id',
    getRecordAction: actionLoadActFileData,
    createAction: actionPostActFileData,
    updateAction: actionPutActFileData,
    mergeElement: (props) => {
      return getDefaultInspectActFileElement(props.element);
    },
    schema: inspectActFileFormSchema,
    permissions: inspectActScanPermissions,
  }),
)(InspectActFileForm);
