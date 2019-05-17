import * as React from 'react';
import FieldName from './name/FieldName';
import FieldMeasureUnitId from './measure_unit_id/FieldMeasureUnitId';
import { ContextFormField } from 'components/new/utils/context/form/@types/fields';
import FieldWaybillDates from './waybill/waybill_dates/FieldWaybillDates';
import FieldWaybillEmployeeChangeStatus from './waybill/waybill_employee_change_status/FieldWaybillEmployeeChangeStatus';
import FieldWaybillStructureAndAccompanyingPerson from './waybill/waybill_structure_and_accompanying_person/FieldWaybillStructureAndAccompanyingPerson';
import FieldDataWaybillMissions from 'components/new/utils/context/form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_missions/FieldWaybillMissions';
// import FieldDefault from './default/FieldDefault';
import FieldWaybillCarId from './waybill/waybill_car_id/FieldWaybillCarId';
import FieldWaybillTrailerId from './waybill/waybill_trailer_id/FieldWaybillTrailerId';
import FieldIsBnsoBroken from './is_bnso_broken/FieldIsBnsoBroken';
import FieldWaybillWorkModeId from './waybill/waybill_work_mode_id/FieldWaybillWorkModeId';
import FieldWaybillDriverId from './waybill/waybill_driver_id/FieldWaybillDriverId';

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
  waybill_missions: FieldDataWaybillMissions,
  waybill_car_id: FieldWaybillCarId,
  waybill_trailer_id: FieldWaybillTrailerId,
  is_bnso_broken: FieldIsBnsoBroken,
  waybill_driver_id: FieldWaybillDriverId,
  waybill_work_mode_id: FieldWaybillWorkModeId,
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
