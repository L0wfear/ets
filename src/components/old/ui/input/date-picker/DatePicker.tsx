import * as React from 'react';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import * as cx from 'classnames';
import * as moment from 'moment';

import { createValidDateTime, createValidDate, createValidYear } from 'components/@next/@utils/dates/dates';

const DTPicker: any = DateTimePicker;

export type DatePickerProps = {
  date: any;
  onChange?: any;
  id?: string;
  className?: string;
  time?: boolean;
  calendar?: boolean;
  disabled?: boolean;
  makeGoodFormat?: boolean;
  preventDateTime?: boolean;
  views?: Array<'month' | 'year' | 'decade' | 'century'>;
  makeOnlyYearFormat?: boolean;
  style?: object;
  footer?: boolean;
  min?: Date;
  max?: Date;
};

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    time = true,
    calendar = true,
    makeGoodFormat = false,
    makeOnlyYearFormat = false,
    preventDateTime,
    views = ['month', 'year', 'decade', 'century'],
    footer = true,
    min = new Date(1900, 0, 1),
    max = new Date(2099, 11, 31),
  } = props;
  const format = `${calendar ? `${makeOnlyYearFormat ? global.APP_YEAR_FORMAT : global.APP_DATE_FORMAT} ` : '' }${time ? global.APP_TIME_FORMAT : ''}`;
  const value = React.useMemo(() => {
    return (
      props.date && typeof props.date === 'string'
        ? moment(props.date).toDate()
        : props.date
    );
  }, [props.date]);
  const defaultCurrentDate = React.useMemo(() => value || props.min, [props.min, value]);

  const handleChange = React.useCallback(
    (valueRaw) => {
      let valueNew = valueRaw;
      if (valueNew && makeOnlyYearFormat) {
        valueNew = createValidYear(valueNew);
      }
      if (valueNew && makeGoodFormat) {
        valueNew = (
          (time || preventDateTime)
            ? createValidDateTime(valueRaw)
            : createValidDate(valueRaw)
        );
      }

      props.onChange(valueNew);
    },
    [props.onChange, makeGoodFormat, preventDateTime],
  );

  React.useEffect(() => {
    const {
      date
    } = props;
    const needUpdate 
      = date && (
        (makeOnlyYearFormat && date !== createValidYear(value))
        || (makeGoodFormat && date !== ((time || preventDateTime) ? createValidDateTime(value) : createValidDate(value)))
      );
      
    if (needUpdate) {
      handleChange(date);
    }
  
  }, [props.date, value, handleChange]);

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
      views={views}
      footer={footer}
      min={min}
      max={max}
      defaultCurrentDate={defaultCurrentDate}
    />
  );
};

export default DatePicker;
