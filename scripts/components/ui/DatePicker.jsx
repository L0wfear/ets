import React, { Component } from 'react';
//import { findDOMNode } from 'react-dom';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import moment from 'moment';
import localizer from 'react-widgets/lib/localizers/moment';
//import rome from 'rome';
//import 'globalize/lib/cultures/globalize.culture.ru-RU';
//import 'globalize';
//
localizer( moment );

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
  }

 /* componentDidMount() {
    let element = findDOMNode(this);

    let romeObj = rome(element);
    romeObj.setValue(this.props.date)

   // debugger;
  }*/

  render() {
    let { time = true } = this.props;
    let DATE_FORMAT = time ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
    let TIME_FORMAT = 'HH:mm';

    //return //<input disabled={this.props.disabled}/>
    return <DateTimePicker onChange={this.props.onChange}
      format={DATE_FORMAT}
      timeFormat={TIME_FORMAT}
  		//culture="ru-RU"
      className="chart-datepicker"
      disabled={this.props.disabled}
      step={5}
      //messages={translation}
      value={this.props.date}
      time={time}/>
  }
}
