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
    let { time = true, date, disabled, min, max } = this.props;
    let DATE_FORMAT = time ? `${global.APP_DATE_FORMAT} HH:mm` : `${global.APP_DATE_FORMAT}`;
    let TIME_FORMAT = 'HH:mm';

    if (typeof date === 'string') {
      date = moment(date).toDate();
    }

    if (typeof min === 'string') {
      min = moment(min).toDate();
    } else if (typeof min === 'undefined' || min === null) {
      min = new Date(1900, 0, 1);
    }

    if (typeof max === 'string') {
      max = moment(max).toDate();
    } else if (typeof max === 'undefined' || max === null){
      max = new Date(2099, 11, 31);
    }

    //return //<input disabled={this.props.disabled}/>
    return (
      <DateTimePicker onChange={this.props.onChange}
                      format={DATE_FORMAT}
                      timeFormat={TIME_FORMAT}
                  		culture="ru-RU"
                      className="chart-datepicker"
                      disabled={disabled}
                      step={5}
                      min={min}
                      max={max}
                      //messages={translation}
                      value={date}
                      time={time}/>
    );

  }
}
