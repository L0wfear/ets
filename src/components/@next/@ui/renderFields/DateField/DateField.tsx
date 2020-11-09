import * as React from 'react';
import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import cx from 'classnames';
import { isNumber } from 'util';
import { DateFieldUi } from 'components/@next/@ui/renderFields/DateField/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { ExtFieldDate } from 'components/@next/@ui/renderFields/@types';
import WarningBlock from 'components/@next/@ui/renderFields/WarningBlock/WarningBlock';

const DateField: React.FC<ExtFieldDate> = React.memo(
  (props) => {
    const { label, warning, error, modalKey, minHeightLabel, ...datePickerProps } = props;
    const { date, value, className = '' } = props;

    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    const dateClassName = cx({ 'has-error': error || warning });

    return (
      <SingleUiElementWrapper
        hidden={props.hidden}
        className={className}
        style={{ marginBottom: typeof label === 'string' ? 15 : 0 }}>
        {typeof label === 'string' && (
          <FieldLabel
            style={{
              minHeight: isNumber(minHeightLabel) ? minHeightLabel : 15,
            }}>
            {label}
          </FieldLabel>
        )}
        <DateFieldUi
          {...datePickerProps}
          id={id}
          date={date || value}
          className={dateClassName}
        />
        {(warning && !error) && (
          <WarningBlock warning={warning} />
        )}
        <ErrorsBlock
          hidden={!error}
          error={error}
        />
      </SingleUiElementWrapper>
    );
  },
);

export default DateField;
