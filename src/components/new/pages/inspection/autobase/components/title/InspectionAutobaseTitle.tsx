import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

const InspectionAutobaseTitle: React.FC<{}> = () => {
  return (
    <Row>
      <Col md={12}>
        <h4>
          Мониторинг обустройства автобаз
        </h4>
      </Col>
    </Row>
  );
};

export default React.memo(InspectionAutobaseTitle);
