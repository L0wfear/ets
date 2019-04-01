import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

const InspectionTitle: React.FC<{ title: string }> = (props) => {
  return (
    <Row>
      <Col md={12}>
        <h4>
          {props.title}
        </h4>
      </Col>
    </Row>
  );
};

export default React.memo(InspectionTitle);
