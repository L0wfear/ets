import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { metaMaintenanceWork } from 'redux-main/reducers/modules/form_data_record/form_data/maintenance_work/default';
import useFormData from 'components/@next/@form/hook_selectors/useForm';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldName from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/name/FieldName';
import FieldMeasureUnitId from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/measure_unit_id/FieldMeasureUnitId';
import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';

type Props = {
  formDataKey: FormKeys;
  handleHide: any;
};

const MaintenanceWorkForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey<any>(state, formDataKey));
    const IS_CREATING = useFormData.useFormDataSchemaIsCreating<any>(props.formDataKey);

    const title = (
      IS_CREATING
        ? metaMaintenanceWork.schema.header.title.create
        : metaMaintenanceWork.schema.header.title.update
    );

    const isPermitted = useFormData.useFormDataIsPermitted(props.formDataKey);
    const canSave = useFormData.useFormDataCanSave<any>(props.formDataKey);
    const handleSubmitPromise = useFormData.useFormDataHandleSubmitPromise<any>(props.formDataKey);

    const dispatch = etsUseDispatch();

    const handleSubmit = React.useCallback(
      async () => {
        let response = null;
        try {
          response = await handleSubmitPromise();
        } catch (error) {
          return;
        }
        props.handleHide(true, response);
      },
      [dispatch, props.handleHide, handleSubmitPromise],
    );

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={meta.page} path={meta.path} typePreloader="mainpage">
          <FieldName formDataKey={formDataKey} />
          <FieldMeasureUnitId formDataKey={formDataKey} />
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted && (
              <EtsBootstrap.Button disabled={!canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
            )
          }
          <EtsBootstrap.Button onClick={props.handleHide}>Отменить</EtsBootstrap.Button>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default MaintenanceWorkForm;
