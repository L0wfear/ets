import * as React from 'react';
import FieldName from './name/FieldName';
import FieldMeasureUnitId from './measure_unit_id/FieldMeasureUnitId';
import { ContextFormField } from 'components/new/utils/context/form/@types/fields';
import FieldOnLineString from './waybill/waybill_idle_time_on_line/field_on_line_string/FieldOnLineString';
import WaybillFormBody from './waybill/WaybillFormBody';

type SwitchFieldsProps = {
  fieldData: ContextFormField;
  formDataKey: string;
};

const ComponentsByKey: Record<ContextFormField['key'], React.ComponentType<any>> = {
  name: FieldName,
  measure_unit_id: FieldMeasureUnitId,
  downtime_hours_work: FieldOnLineString,
  downtime_hours_duty: FieldOnLineString,
  downtime_hours_dinner: FieldOnLineString,
  downtime_hours_repair: FieldOnLineString,
  waybill_form_body: WaybillFormBody,
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
