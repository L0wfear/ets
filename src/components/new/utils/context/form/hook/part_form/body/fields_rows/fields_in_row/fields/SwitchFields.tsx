import * as React from 'react';
import FieldName from './FieldName';
import FieldMeasureUnitId from './FieldMeasureUnitId';

type SwitchFieldsProps = {
  fieldData: any;
  formDataKey: string;
};

const SwitchFields: React.FC<SwitchFieldsProps> = React.memo(
  (props) => {
    if (props.fieldData.key === 'name') {
      return (
        <FieldName
          fieldData={props.fieldData}
          formDataKey={props.formDataKey}
        />
      );
    }
    if (props.fieldData.key === 'measure_unit_id') {
      return (
        <FieldMeasureUnitId
          fieldData={props.fieldData}
          formDataKey={props.formDataKey}
        />
      );
    }

    return (
      <div>{`Определи поле для ${props.fieldData.key}`}</div>
    );
  },
);

export default SwitchFields;
