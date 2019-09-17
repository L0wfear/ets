import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';

import { mapFormMeta } from 'redux-main/reducers/modules/form_data_record/actions';
import ModalHeaderDefault from 'components/@next/@form/hook/part_form/ModalHeaderDefault';
import ModalFooterDefault from 'components/@next/@form/hook/part_form/ModalFooterDefault';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

import DefaultFieldString from 'components/@next/@form/defult_fields/DefaultFieldString';
import DefaultFieldBoolean from 'components/@next/@form/defult_fields/DefaultFieldBoolean';
import FieldMeasureUnitId from 'components/new/pages/nsi/data_for_calculation/pages/fuel_operations/form/measure_unit_id/FieldMeasureUnitId';

type Props = {
  formDataKey: 'fuel_operations';
  handleHide: any;
};

const FuelOperationsForm: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const bsSizeForm = mapFormMeta[formDataKey].bsSizeForm;
    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    return (
      <EtsBootstrap.ModalContainer id={`modal-${formDataKey}}`} show onHide={props.handleHide} bsSize={bsSizeForm}>
        <ModalHeaderDefault formDataKey={formDataKey} handleHide={props.handleHide} />
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <DefaultFieldString<FuelOperationActive> formDataKey={formDataKey} field_label="Операция" field_name="name" />
          <FieldMeasureUnitId formDataKey={formDataKey} />
          <DefaultFieldBoolean<FuelOperationActive> formDataKey={formDataKey} field_label="Без учета пробега" field_name="is_excluding_mileage" />
          <DefaultFieldBoolean<FuelOperationActive> formDataKey={formDataKey} field_label="Для спецоборудования" field_name="equipment" />
        </ModalBodyPreloader>
        <ModalFooterDefault formDataKey={formDataKey} handleHide={props.handleHide} />
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default FuelOperationsForm;
