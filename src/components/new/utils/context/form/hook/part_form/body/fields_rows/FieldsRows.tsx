import * as React from 'react';
import useForm from 'components/new/utils/context/form/useFormData';
import { Row, Col } from 'react-bootstrap';
import SwitchFields from './fields_in_row/fields/SwitchFields';

type FieldsRowsProps = {
  formDataKey: string;
};

const FieldsRows: React.FC<FieldsRowsProps> = React.memo(
  (props) => {
    const fields = useForm.useFormDataSchemaBodyFields(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <Row>
            {
              Object.entries(fields).map(([fieldDataKey, fieldData]: any) => (
                <Col md={fieldData.md || 12} key={fieldDataKey}>
                  <SwitchFields fieldData={fieldData} fieldDataKey={fieldDataKey} formDataKey={props.formDataKey} />
                </Col>
              ))
            }
          </Row>
        );
      },
      [fields, props.formDataKey],
    );
  },
);

export default FieldsRows;
