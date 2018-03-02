import React, { Component, PropTypes } from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import localizer from 'react-widgets/lib/localizers/moment';
import cx from 'classnames';
import moment from 'moment';
import 'moment/locale/ru';

localizer(moment);

export default class DatePicker extends Component {

  static get propTypes() {
    return {
      time: PropTypes.bool,
      date: PropTypes.any,
      disabled: PropTypes.any,
      min: PropTypes.any,
      max: PropTypes.any,
      onChange: PropTypes.func,
      className: PropTypes.string,
      style: PropTypes.object,
    };
  }

  shouldComponentUpdate(props) {
    return props.date !== this.props.date || props.disabled !== this.props.disabled || props.time !== this.props.time;
  }

  render() {
    const { time = true, disabled, className = '', style = {}, id } = this.props;
    let { date, min, max } = this.props;
    const DATE_FORMAT = time ? `${global.APP_DATE_FORMAT} HH:mm` : `${global.APP_DATE_FORMAT}`;
    const TIME_FORMAT = 'HH:mm';

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
    } else if (typeof max === 'undefined' || max === null) {
      max = new Date(2099, 11, 31);
    }

    const datePickerClassName = cx('chart-datepicker', className);

    return (
      <DateTimePicker
        id={id}
        onChange={this.props.onChange}
        format={DATE_FORMAT}
        timeFormat={TIME_FORMAT}
        culture="ru-RU"
        className={datePickerClassName}
        style={style}
        disabled={disabled}
        step={5}
        // min={min}
        // max={max}
        // messages={translation}
        value={date}
        time={time}
      />
    );
  }
}
