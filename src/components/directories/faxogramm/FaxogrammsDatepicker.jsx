import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/input/DatePicker';

export default (props) => {
  return (
    <Row>
      <Col md={3} />
      <Col md={6} className="faxogramms-date-range">
        <Div className="inline-block faxogramms-date">
          <Datepicker date={props.dateFrom} onChange={props.handleChange.bind(null, 'dateFrom')} />
        </Div>
        <Div className="date-divider">—</Div>
        <Div className="inline-block">
          <Datepicker date={props.dateTo} onChange={props.handleChange.bind(null, 'dateTo')} />
        </Div>
      </Col>
    </Row>
  );
};
