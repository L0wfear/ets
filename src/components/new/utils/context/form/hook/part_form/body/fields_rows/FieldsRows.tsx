import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import SwitchFields from './fields_in_row/fields/SwitchFields';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldsRowsProps = {
  formDataKey: string;
};

const FieldsRows: React.FC<FieldsRowsProps> = React.memo(
  (props) => {
    const fields = useForm.useFormDataSchemaBodyFields(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Row>
            {
              Object.entries(fields).map(([fieldDataKey, fieldData]: any) => (
                <EtsBootstrap.Col md={fieldData.md || 12} key={fieldDataKey}>
                  <SwitchFields fieldData={fieldData} fieldDataKey={fieldDataKey} formDataKey={props.formDataKey} />
                </EtsBootstrap.Col>
              ))
            }
          </EtsBootstrap.Row>
        );
      },
      [fields, props.formDataKey],
    );
  },
);

export default FieldsRows;
