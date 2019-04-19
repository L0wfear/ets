import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { createValidDateTime, createValidDate } from 'utils/dates';
import { DatePickerRangeContainer, ColStartDatePickerRange, ColDividerDatePickerRange, ColEndDatePickerRange } from './styled';
import { isBoolean } from 'util';

type DatePickerRangeProps = {
  date_start_id: string;
  date_start_value: any;
  date_start_error?: string | boolean;
  date_start_time?: boolean;
  date_end_id: string;
  date_end_value: any;
  date_end_error?: string | boolean;
  date_end_time?: boolean;
  label?: string | boolean;

  allWidth?: boolean;

  disabled?: boolean;
  onChange: (boundKey: string, value: string) => void;
};

export const DatePickerRange: React.FC<DatePickerRangeProps> = (props) => {
  const onChangeDateStart = React.useCallback(
    (valueRaw) => {
      let value = valueRaw;

      if (value) {
        value = isBoolean(props.date_start_time) && !props.date_start_time ? createValidDate(value) : createValidDateTime(value);
      }
      props.onChange(props.date_start_id, value);
    },
    [props.date_start_id, props.date_start_time],
  );
  const onChangeDateEnd = React.useCallback(
    (valueRaw) => {
      let value = valueRaw;

      if (value) {
        value = isBoolean(props.date_end_time) && !props.date_end_time ? createValidDate(value) : createValidDateTime(value);
      }
      props.onChange(props.date_end_id, value);

    },
    [props.date_end_id, props.date_end_time],
  );

  const labelDatePickerStart = props.label ? props.label : false;
  const labelDatePickerEnd = labelDatePickerStart ? '' : false;

  return (
    <DatePickerRangeContainer allWidth>
      <ColStartDatePickerRange md={5}>
        <ExtField
          id={props.date_start_id}
          type="date"
          time={props.date_start_time}
          label={labelDatePickerStart}
          date={props.date_start_value}
          onChange={onChangeDateStart}
          error={props.date_start_error}
          disabled={props.disabled}
        />
      </ColStartDatePickerRange>
      <ColDividerDatePickerRange md={2} label={labelDatePickerStart}>
        —
      </ColDividerDatePickerRange>
      <ColEndDatePickerRange md={5}>
        <ExtField
          id={props.date_end_id}
          type="date"
          time={props.date_end_time}
          label={labelDatePickerEnd}
          date={props.date_end_value}
          onChange={onChangeDateEnd}
          error={props.date_end_error}
          disabled={props.disabled}
        />
      </ColEndDatePickerRange>
    </DatePickerRangeContainer>
  );
};

export default DatePickerRange;
