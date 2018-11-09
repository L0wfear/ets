import * as React from 'react';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'components/ui/input/date-picker/localizer';
import * as cx from 'classnames';
import * as moment from 'moment';

moment.locale('ru');
momentLocalizer();

interface DatePickerProps {
  date: any;
  onChange: (date: Date | null, dateString: string) => any;
  id?: string;
  className?: string;
  time?: boolean;
  calendar?: boolean;
  disabled?: boolean;
}

const DatePicker: React.SFC<DatePickerProps> = props => {
  const {
    time = true,
    calendar = true,
  } = props;
  let { date: value } = props;
  const format = `${calendar ? `${global.APP_DATE_FORMAT} ` : '' }${time ? global.APP_TIME_FORMAT : ''}`;

  if (typeof value === 'string') {
    value = moment(value).toDate();
  }

  return (
    <DateTimePicker
      id={props.id}
      containerClassName={cx('chart-datepicker', props.className)}
      value={value}
      format={format}
      timeFormat={global.APP_TIME_FORMAT}
      step={5}
      time={time}
      date={calendar}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  );
}

export default DatePicker;
