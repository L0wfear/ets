import * as React from 'react';
import { Col } from 'react-bootstrap';

export type FieldDefaultProps = {
  fieldData: any;
  formDataKey: string;
};

const FieldDefault: React.FC<FieldDefaultProps> = React.memo(
  (props) => (
    <Col md={props.fieldData.md || 12}>
      {props.fieldData.key}
    </Col>
  ),
);

export default FieldDefault;
