import * as React from 'react';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import * as cx from 'classnames';
import * as moment from 'moment';
import { createValidDateTime, createValidDate } from 'utils/dates';

const DTPicker: any = DateTimePicker;

interface DatePickerProps {
  date: any;
  onChange: any;
  id?: string;
  className?: string;
  time?: boolean;
  calendar?: boolean;
  disabled?: boolean;
  makeGoodFormat?: boolean;
}

const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  const {
    time = true,
    calendar = true,
    makeGoodFormat = false,
  } = props;
  let { date: value } = props;
  const format = `${calendar ? `${global.APP_DATE_FORMAT} ` : '' }${time ? global.APP_TIME_FORMAT : ''}`;

  if (typeof value === 'string' && value) {
    value = moment(value).toDate();
  }

  const handleChange = React.useCallback(
    (valueRaw) => {
      let valueNew = valueRaw;
      if (valueNew && makeGoodFormat) {
        valueNew = (
          time
            ? createValidDateTime(valueRaw)
            : createValidDate(valueRaw)
        );
      }

      props.onChange(valueNew);
    },
    [props.onChange],
  );

  return (
    <DTPicker
      id={props.id}
      className={cx('chart-datepicker', props.className)}
      value={value ? value : null}
      format={format}
      timeFormat={global.APP_TIME_FORMAT}
      step={5}
      time={time}
      date={calendar}
      disabled={props.disabled}
      onChange={handleChange}
    />
  );
};

export default DatePicker;
