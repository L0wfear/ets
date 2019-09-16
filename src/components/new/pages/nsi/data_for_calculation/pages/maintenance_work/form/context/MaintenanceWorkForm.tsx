import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import FieldName from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/name/FieldName';
import FieldMeasureUnitId from 'components/new/pages/nsi/data_for_calculation/pages/maintenance_work/form/context/measure_unit_id/FieldMeasureUnitId';
import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';

type Props = {
  formDataKey: FormKeys;
  handleHide: any;
};

const MaintenanceWorkForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <FieldName formDataKey={formDataKey} />
          <FieldMeasureUnitId formDataKey={formDataKey} />
        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default MaintenanceWorkForm;
