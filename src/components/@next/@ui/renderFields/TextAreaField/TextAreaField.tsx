import * as React from 'react';
import SingleUiElementWrapper from '../SingleUiElementWrapper';
import cx from 'classnames';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled/index';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { TextAreaFieldUi } from 'components/@next/@ui/renderFields/TextAreaField/styled';
import { ExtFieldText } from 'components/@next/@ui/renderFields/@types';

const TextAreaField: React.FC<ExtFieldText> = React.memo(
  (props) => {
    const {
      error,
      label = '',
      readOnly = false,
      disabled = false,
      hidden,
      rows = 5,
      textAreaStyle = {},
      modalKey,
    } = props;
    let { value } = props;
    if (value === undefined || value === null) {
      value = '';
    }

    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    const wrapperClassName = cx({
      'textarea-field': true,
      'has-error': error,
    });

    return (
      <SingleUiElementWrapper hidden={hidden} className={wrapperClassName}>
        <FieldLabel>
          <span>{label}</span>
        </FieldLabel>
        <TextAreaFieldUi
          id={id}
          style={textAreaStyle}
          className="form-control form-group"
          rows={rows}
          disabled={readOnly || disabled}
          onChange={props.onChange}
          value={value}
        />
        <ErrorsBlock
          hidden={!error}
          error={error}
        />
      </SingleUiElementWrapper>
    );
  },
);

export default TextAreaField;
