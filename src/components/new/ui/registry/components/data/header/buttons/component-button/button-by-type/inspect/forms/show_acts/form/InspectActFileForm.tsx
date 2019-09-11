import * as React from 'react';
import { compose } from 'recompose';

import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { actionChangeActFiles } from 'redux-main/reducers/modules/inspect/act_scan/inspect_act_scan_actions';
import { PropsInspectActFileForm, OwnInspectActFileFormProps, PropsInspectActFileFormWithForm } from './@types/InspectActFileForm';
import inspectActScanPermissions from '../registry/permissions';
import { getDefaultInspectActFileElement } from './utils';
import { inspectActFileFormSchema } from './schema';
import { FileField } from 'components/old/ui/input/fields';

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
                value={state.files}
                error={errors.files}
                onChange={props.handleChange}
                disabled={!isPermitted || !IS_CREATING}
                boundKeys="files"
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
    createAction: actionChangeActFiles,
    updateAction: actionChangeActFiles,
    mergeElement: (props) => {
      return getDefaultInspectActFileElement(props.element);
    },
    schema: inspectActFileFormSchema,
    permissions: inspectActScanPermissions,
  }),
)(InspectActFileForm);
