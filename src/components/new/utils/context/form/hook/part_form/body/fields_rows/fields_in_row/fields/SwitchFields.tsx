import * as React from 'react';
import FieldName from './FieldName';
import FieldMeasureUnitId from './FieldMeasureUnitId';

type SwitchFieldsProps = {
  fieldData: any;
  fieldDataKey: string;
  formDataKey: string;
};

const SwitchFields: React.FC<SwitchFieldsProps> = React.memo(
  (props) => {
    if (props.fieldData.key === 'name') {
      return (
        <FieldName
          fieldData={props.fieldData}
          fieldDataKey={props.fieldDataKey}
          formDataKey={props.formDataKey}
        />
      );
    }
    if (props.fieldData.key === 'measure_unit_id') {
      return (
        <FieldMeasureUnitId
          fieldData={props.fieldData}
          fieldDataKey={props.fieldDataKey}
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
