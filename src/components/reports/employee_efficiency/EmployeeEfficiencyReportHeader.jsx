import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';

export default ({ date_end, date_start, handleChange, onClick }) => (
  <Div>
    <Row>
      <Col md={4} />
      <Col md={4}>
        <Div><label>Период формирования</label></Div>
        <Div className="inline-block reports-date">
          <Datepicker date={date_start} onChange={v => handleChange('date_start', v)} />
        </Div>
        <Div className="inline-block reports-date">
          <Datepicker date={date_end} onChange={v => handleChange('date_end', v)} />
        </Div>
      </Col>
      <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
        <Button bsSize="small" onClick={() => onClick()}>Сформировать отчет</Button>
      </Col>
    </Row>
  </Div>
);
