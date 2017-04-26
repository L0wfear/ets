import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import { bindable } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';

const DatePicker = bindable(Datepicker);

const TrackEventsReportsHeader = ({ readOnly, handleChange, date_start, date_end, onClick}) =>
  <Div>
    <Row>
      <Col md={4} />
      <Col md={5}>
        <Div><label>Период формирования</label></Div>
        <Div className="inline-block reports-date">
          <DatePicker
            time={false}
            date={date_start}
            onChange={handleChange}
            bindOnChange={'date_start'}
            disabled={readOnly}
          />
        </Div>
        <Div className="inline-block reports-date">
          <DatePicker
            time={false}
            date={date_end}
            onChange={handleChange}
            bindOnChange={'date_end'}
            disabled={readOnly}
          />
        </Div>
      </Col>
      <Col md={3}>
        {
          !readOnly &&
          <Button
            style={{ position: 'relative', top: 30 }}
            bsSize="small"
            onClick={onClick}
          >Сформировать отчет</Button>
        }
      </Col>
    </Row>
  </Div>;

TrackEventsReportsHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default TrackEventsReportsHeader;
