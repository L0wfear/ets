import * as React from 'react';
import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import { CheckBoxFieldUi } from 'components/@next/@ui/renderFields/CheckBoxField/styled';
import { ExtFieldBoolean } from 'components/@next/@ui/renderFields/@types';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';

const CheckBoxField: React.FC<ExtFieldBoolean> = React.memo(
  (props) => {
    const {
      label = '',
      className = 'default-boolean-input',
      modalKey,
      error,
    } = props;
    const checkboxStyle = { fontSize: '20px', margin: '5px' };
    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;
    const showError = typeof error === 'boolean' ? error : true;

    return (
      <>
        <SingleUiElementWrapper hidden={props.hidden} className={className}>
          <FieldLabel>
            {!props.labelAfter && label}
            <CheckBoxFieldUi
              id={id}
              type="checkbox"
              style={props.checkboxStyle ? checkboxStyle : undefined}
              checked={props.value}
              onChange={props.onChange}
              disabled={props.disabled}
            />
            {props.labelAfter && label}
          </FieldLabel>
        </SingleUiElementWrapper>
        <ErrorsBlock
          showError={showError}
          hidden={!error}
          error={error}
        />
      </>
    );
  },
);

export default CheckBoxField;
