import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { createValidDateTime, createValidDate } from 'components/@next/@utils/dates/dates';
import { DatePickerRangeContainer, DividerDatePickerRange } from './styled';
import { isBoolean } from 'util';
import EtsBootstrap from '../@bootstrap';

type DatePickerRangeProps = {
  date_start_id: string;
  date_start_key?: string;
  date_start_value: any;
  date_start_error?: string | boolean;
  date_start_time?: boolean;
  date_end_id: string;
  date_end_key?: string;
  date_end_value: any;
  date_end_error?: string | boolean;
  date_end_time?: boolean;

  allWidth?: boolean;

  disabled?: boolean;
  onChange: (boundKey: any, value: string) => void;
} & (
  {
    label?: string | boolean;
  } | {
    date_start_label?: string | boolean;
    date_end_label?: string | boolean;
  }
);

export const DatePickerRange: React.FC<DatePickerRangeProps> = (props) => {
  const onChangeDateStart = React.useCallback(
    (valueRaw) => {
      let value = valueRaw;

      if (value) {
        value = isBoolean(props.date_start_time) && !props.date_start_time ? createValidDate(value) : createValidDateTime(value);
      }
      props.onChange(props.date_start_key || props.date_start_id, value);
    },
    [props.date_start_id, props.date_start_time, props.onChange],
  );
  const onChangeDateEnd = React.useCallback(
    (valueRaw) => {
      let value = valueRaw;

      if (value) {
        value = isBoolean(props.date_end_time) && !props.date_end_time ? createValidDate(value) : createValidDateTime(value);
      }
      props.onChange(props.date_end_key || props.date_end_id, value);

    },
    [props.date_end_id, props.date_end_time, props.onChange],
  );

  const labelDatePickerStart = (
    'date_start_label' in props
      ? props.date_start_label
      : (
        'label' in props
        ? props.label
        : false
      )
  );
  const labelDatePickerEnd = (
    'date_end_label' in props
      ? props.date_end_label
      : (
        labelDatePickerStart
          ? ''
          : false
      )
  );

  return (
    <DatePickerRangeContainer allWidth={props.allWidth}>
      <EtsBootstrap.Col md={6}>
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
      </EtsBootstrap.Col>
      <DividerDatePickerRange label={Boolean(labelDatePickerStart || labelDatePickerEnd)} date_start_label={'date_start_label' in props && ''}>
        —
      </DividerDatePickerRange>
      <EtsBootstrap.Col md={6}>
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
      </EtsBootstrap.Col>
    </DatePickerRangeContainer>
  );
};

export default DatePickerRange;
