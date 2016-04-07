import React, { Component } from 'react';
import Datepicker from './DatePicker.jsx';

export default class IntervalPicker extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(index, data) {
    let {interval = [null, null] } = this.props;
    interval[index] = data;
    this.props.onChange(interval);
  }

  render() {
    let { interval = [null,null] } = this.props;
    return (
      <div>
        с
        <Datepicker date={interval[0]} onChange={this.handleChange.bind(this, 0)} max={interval[1]} />
        по
        <Datepicker date={interval[1]} onChange={this.handleChange.bind(this, 1)} min={interval[0]} />
      </div>
    );
  }
}
