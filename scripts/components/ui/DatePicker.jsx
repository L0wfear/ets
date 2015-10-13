import React, { Component } from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
//import 'globalize/lib/cultures/globalize.culture.ru-RU';
//import 'globalize';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let DATE_FORMAT = 'yyyy-MM-dd HH:mm';
    let TIME_FORMAT = 'HH:mm';
    let translation = {
      calendarButton: "Выберите дату",
      timeButton: "Выберите время"
    }

    return <DateTimePicker onChange={this.props.onChange}
      format={DATE_FORMAT}
      timeFormat={TIME_FORMAT}
  		//culture="ru-RU"
      className="chart-datepicker"
      disabled={this.props.disabled}
      step={5}
      messages={translation}
      value={this.props.date}/>
  }
}