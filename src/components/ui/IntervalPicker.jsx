import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Datepicker from './DatePicker.jsx';

export default class IntervalPicker extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(index, data) {
    let { interval = [null, null] } = this.props;
    const { setDefTime = r => r } = this.props;

    if (!interval[index]) {
      interval[index] = setDefTime(data, index);
    } else {
      interval[index] = data;
    }

    this.props.onChange(interval);
  }

  render() {
    let { interval = [null, null] } = this.props;
    return (
      <div className="interval-picker">
        <Row style={{ margin: '0 0 5px 0' }}>
          <Col md={1} style={{ padding: '6px 6px 0 0', fontWeight: 'bold' }}>
            с
          </Col>
          <Col md={11} style={{ padding: 0 }}>
            <Datepicker date={interval[0]} onChange={this.handleChange.bind(this, 0)} max={interval[1]} />
          </Col>
        </Row>
        <Row style={{ margin: 0 }}>
          <Col md={1} style={{ padding: '6px 6px 0 0', fontWeight: 'bold' }}>
            по
          </Col>
          <Col md={11} style={{ padding: 0 }}>
            <Datepicker date={interval[1]} onChange={this.handleChange.bind(this, 1)} min={interval[0]} />
          </Col>
        </Row>
      </div>
    );
  }
}
