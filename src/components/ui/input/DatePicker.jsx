import React, { Component, PropTypes } from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'components/ui/input/date-picker/localizer';

import cx from 'classnames';
import moment from 'moment';

moment.locale('ru');
momentLocalizer();

export default class DatePicker extends Component {

  static get propTypes() {
    return {
      id: PropTypes.string,
      className: PropTypes.string,
      style: PropTypes.object,
      date: PropTypes.any,
      time: PropTypes.bool,
      calendar: PropTypes.bool,
      disabled: PropTypes.any,
      onChange: PropTypes.func,
    };
  }

  shouldComponentUpdate(props) {
    return props.date !== this.props.date || props.disabled !== this.props.disabled || props.time !== this.props.time;
  }

  render() {
    const { time = true, disabled, className = '', style = {}, id, calendar = true } = this.props;
    let { date } = this.props;
    const DATE_FORMAT = time ? `${global.APP_DATE_FORMAT} ${global.APP_TIME_FORMAT}` : `${global.APP_DATE_FORMAT}`;

    if (typeof date === 'string') {
      date = moment(date).toDate();
    }

    const datePickerClassName = cx('chart-datepicker', className);

    return (
      <DateTimePicker
        culture="ru"
        id={id}
        className={datePickerClassName}
        style={style}
        value={date}
        format={calendar ? DATE_FORMAT : global.APP_TIME_FORMAT}
        timeFormat={global.APP_TIME_FORMAT}
        step={5}
        time={time}
        date={calendar}
        disabled={disabled}
        onChange={this.props.onChange}
      />
    );
  }
}
