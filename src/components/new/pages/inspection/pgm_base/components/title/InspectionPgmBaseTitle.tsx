import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

const InspectionPgmBaseTitle: React.FC<{}> = () => {
  return (
    <Row>
      <Col md={12}>
        <h4>
          Мониторинг состояния баз хранения ПГМ
        </h4>
      </Col>
    </Row>
  );
};

export default React.memo(InspectionPgmBaseTitle);
