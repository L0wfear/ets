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
  makeGoodFormatInitial?: boolean;
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
    makeGoodFormatInitial = false,
    makeOnlyYearFormat = false,
    preventDateTime,
    views = ['month', 'year', 'decade', 'century'],
    footer = true,
    min = new Date(1900, 0, 1),
    max = new Date(2099, 11, 31),
  } = props;
  const currentDate = React.useMemo(() => props.min, [props.min]);
  let { date: value } = props;
  const format = `${calendar ? `${makeOnlyYearFormat ? global.APP_YEAR_FORMAT : global.APP_DATE_FORMAT} ` : '' }${time ? global.APP_TIME_FORMAT : ''}`;

  if (typeof value === 'string' && value) {
    value = moment(value).toDate();
  }

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
    if (value && makeOnlyYearFormat) {
      value = createValidYear(value);
    }
    if (value && makeGoodFormat && makeGoodFormatInitial) {
      value = (
        (time || preventDateTime)
          ? createValidDateTime(value)
          : createValidDate(value)
      );
      props.onChange(value);
    }
  }, []);

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
      currentDate={currentDate}
    />
  );
};

export default DatePicker;
