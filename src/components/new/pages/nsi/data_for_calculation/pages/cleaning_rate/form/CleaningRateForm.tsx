import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import FieldTechnicalOperationId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/technical_operation_id/FieldTechnicalOperationId';
import FieldProperty from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/property/FieldProperty';
import DefaultFieldString from 'components/@next/@form/defult_fields/DefaultFieldString';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import FieldMeasureUnitId from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form/measure_unit_id/FieldTechnicalOperationId';

type Props = {
  formDataKey: 'cleaning_rate';
  handleHide: any;
};

const CleaningRateForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <FieldTechnicalOperationId formDataKey={formDataKey} />
          <FieldProperty formDataKey={formDataKey} />
          <DefaultFieldString<CleaningRate> formDataKey={formDataKey} field_label="Коэффициент" field_name="value" />
          <FieldMeasureUnitId formDataKey={formDataKey} />
        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default CleaningRateForm;
