import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';
import * as cx from 'classnames';
import { FormControl } from 'react-bootstrap';
import { InputContainer } from 'components/new/ui/field/styled/styled';

type PropsInputNumber = {
  error?: string;
  noShowError?: boolean;
  value: number | string | string[];
  hidden?: boolean;
  label?: string;
  noShowLabel?: boolean;
  onChange: any;
  disabled?: boolean;
  step: number;
};

class InputNumber extends React.PureComponent<PropsInputNumber, {}> {
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
                <label className="control-label"><span>{this.props.label}</span></label>
              )
              : (
                <DivNone />
              )
            }
            <FormControl lang="en" type="number" className={inputClassName} {...mainProps} value={value} />
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

export default InputNumber;
