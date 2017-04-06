import React, { Component } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';

class TrackEventsReportsHeader extends Component {
  render() {
    const props = this.props;

    return (
      <Div>
        <Row>
          <Col md={4} />
          <Col md={5}>
            <Div><label>Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker time={false} date={props.date_start} onChange={props.handleChange.bind(null, 'date_start')} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker time={false} date={props.date_end} onChange={props.handleChange.bind(null, 'date_end')} />
            </Div>
          </Col>
          <Col md={3}>
            <Button style={{position: 'relative', top: 30}} bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }

}

TrackEventsReportsHeader.contextTypes = {
  flux: React.PropTypes.object,
};

export default TrackEventsReportsHeader;
