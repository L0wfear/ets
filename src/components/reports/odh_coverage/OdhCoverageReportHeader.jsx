import React, { Component } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';

export default class OdhCoverageReportHeader extends Component {

  render() {
    const props = this.props;

    return (
      <Div>
        <Row>
          <Col md={5}>
            <Datepicker className="inline-block" time={false} date={props.date_start} onChange={props.onChange} />
            <Button className="inline-block" style={{ marginLeft: 20 }} bsSize="small" onClick={props.onSubmit}>Сформировать отчет</Button>
          </Col>
          <Col md={2} />
        </Row>
      </Div>
    );
  }

}
