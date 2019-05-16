import * as React from 'react';
import FieldName from './name/FieldName';
import FieldMeasureUnitId from './measure_unit_id/FieldMeasureUnitId';
import { ContextFormField } from 'components/new/utils/context/form/@types/fields';
import FieldWaybillDates from './waybill/waybill_dates/FieldWaybillDates';
import FieldWaybillEmployeeChangeStatus from './waybill/waybill_employee_change_status/FieldWaybillEmployeeChangeStatus';
import FieldWaybillStructureAndAccompanyingPerson from './waybill/waybill_structure_and_accompanying_person/FieldWaybillStructureAndAccompanyingPerson';

type SwitchFieldsProps = {
  fieldData: ContextFormField;
  formDataKey: string;
};

const ComponentsByKey: Record<ContextFormField['key'], React.ComponentType<SwitchFieldsProps>> = {
  name: FieldName,
  measure_unit_id: FieldMeasureUnitId,
  waybill_employee_change_status: FieldWaybillEmployeeChangeStatus,
  waybill_structure_and_accompanying_person: FieldWaybillStructureAndAccompanyingPerson,
  waybill_dates: FieldWaybillDates,
};

const SwitchFields: React.FC<SwitchFieldsProps> = React.memo(
  (props) => {
    const ComponentName = ComponentsByKey[props.fieldData.key];

    if (ComponentName) {
      return (
        <ComponentName
          fieldData={props.fieldData}
          formDataKey={props.formDataKey}
        />
      );
    }

    return (
      <div>{`Определи поле для ${props.fieldData.key} в SwitchFields ComponentsByKey`}</div>
    );
  },
);

export default SwitchFields;
