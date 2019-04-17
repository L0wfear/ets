import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';
import * as cx from 'classnames';
import { InputContainer } from 'components/new/ui/field/styled/styled';
import DatePicker from 'components/ui/input/date-picker/DatePicker';

type PropsInputDate = {
  id?: string;
  error?: string;
  noShowError?: boolean;
  value: number | string | string[];
  hidden?: boolean;
  label?: string;
  noShowLabel?: boolean;
  time?: boolean;
  onChange: any;
  disabled?: boolean;
};

class InputDate extends React.PureComponent<PropsInputDate, {}> {
  render() {
    const {
      error,
      noShowLabel,
      label,
      noShowError,
      ...mainProps
    } = this.props;

    const inputClassName = cx({ 'has-error': error });
    const { value } = this.props;

    return (
      !this.props.hidden
      ? (
        <div>
          <InputContainer>
            {
              !noShowLabel
              ? (
                <span>{this.props.label}</span>
              )
              : (
                <DivNone />
              )
            }
            <DatePicker
              id={this.props.id}
              className={inputClassName}
              date={value}
              time={Boolean(mainProps.time)}
              onChange={mainProps.onChange}
              disabled={mainProps.disabled}
              makeGoodFormat
            />
          </InputContainer>
          {
            !noShowError ? (
              <div className="error">{error}</div>
            )
            : (
              <DivNone />
            )
          }
        </div>
      )
      : (
        <DivNone />
      )
    );
  }
}

export default InputDate;
