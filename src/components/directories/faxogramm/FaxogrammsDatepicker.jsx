import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/date-picker/DatePicker.tsx';

export default props => (
  <Row>
    <Col md={3} />
    <Col md={6} className="faxogramms-date-range">
      <Div>
        <Datepicker date={props.create_date_from} onChange={props.handleChange.bind(null, 'create_date_from')} />
      </Div>
      <Div className="date-divider">—</Div>
      <Div>
        <Datepicker date={props.create_date_to} onChange={props.handleChange.bind(null, 'create_date_to')} />
      </Div>
    </Col>
  </Row>
);
