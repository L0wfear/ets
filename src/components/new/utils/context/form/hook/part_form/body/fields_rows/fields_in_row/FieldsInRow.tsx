import * as React from 'react';
import { Col } from 'react-bootstrap';
import SwitchFields from './fields/SwitchFields';

type FieldsInRowProps = {
  formDataKey: string;
  fieldsInRow: any[];
};

const FieldsInRow: React.FC<FieldsInRowProps> = React.memo(
  (props) => {
    const fieldElements: any = React.useMemo(
      () => {
        return (
          props.fieldsInRow.map((fieldData) => (
            <Col md={fieldData.md || 12} key={fieldData.key}>
              <SwitchFields fieldData={fieldData} formDataKey={props.formDataKey} />
            </Col>
          ))
        );
      },
      [props.fieldsInRow, props.formDataKey],
    );

    return (
      fieldElements
    );
  },
);

export default FieldsInRow;
