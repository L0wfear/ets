import * as React from 'react';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Row, Col } from 'react-bootstrap';
import SwitchFields from './fields_in_row/fields/SwitchFields';

type FieldsRowsProps = {
  formDataKey: string;
};

const FieldsRows: React.FC<FieldsRowsProps> = React.memo(
  (props) => {
    const fields = useForm.useFormDataSchemaBodyFields<any>(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <Row>
            {
              fields.map((fieldData) => (
                <Col md={fieldData.md || 12} key={fieldData.key}>
                  <SwitchFields fieldData={fieldData} formDataKey={props.formDataKey} />
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
