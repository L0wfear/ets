import * as React from 'react';
import { SchemaFormContextBody } from 'components/new/utils/context/@types';
import FieldName from './name/FieldName';
import FieldMeasureUnitId from './measure_unit_id/FieldMeasureUnitId';

type SwitchFieldsProps = {
  fieldData: ValuesOf<SchemaFormContextBody<any>['fields']>;
  formDataKey: string;
};

const ComponentsByKey: Record<ValuesOf<SchemaFormContextBody<any>['fields']>['key'], React.ComponentType<SwitchFieldsProps>> = {
  name: FieldName,
  measure_unit_id: FieldMeasureUnitId,
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
