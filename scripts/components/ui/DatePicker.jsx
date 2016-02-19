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
    let { time = true, date, disabled } = this.props;
    let DATE_FORMAT = time ? `${global.APP_DATE_FORMAT} HH:mm` : `${global.APP_DATE_FORMAT}`;
    let TIME_FORMAT = 'HH:mm';

    if (typeof date === 'string') {
      date = moment(date).toDate();
    }

    //return //<input disabled={this.props.disabled}/>
    return (
      <DateTimePicker onChange={this.props.onChange}
                      format={DATE_FORMAT}
                      timeFormat={TIME_FORMAT}
                  		//culture="ru-RU"
                      className="chart-datepicker"
                      disabled={disabled}
                      step={5}
                      //messages={translation}
                      value={date}
                      time={time}/>
    );
    
  }
}
