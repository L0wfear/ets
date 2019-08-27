import * as React from 'react';
import { DivNone } from 'global-styled/global-styled';
import * as cx from 'classnames';
import { InputContainer } from 'components/new/ui/field/styled/styled';
import EtsBootstrap from '../@bootstrap';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';

type PropsInputNumber = {
  id?: string;
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
            <EtsBootstrap.FormControl id={this.props.id} lang="en" type="number" className={inputClassName} {...mainProps} value={value} step={this.props.step} />
          </InputContainer>
          {
            !noShowError ? (
              <ErrorsBlock
                error={error}
              />
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
