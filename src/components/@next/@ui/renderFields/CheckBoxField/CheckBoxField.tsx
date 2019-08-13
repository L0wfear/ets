import * as React from 'react';
import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import { CheckBoxFieldUi } from 'components/@next/@ui/renderFields/CheckBoxField/styled';
import { ExtFieldBoolean } from 'components/old/ui/new/field/ExtField';

const CheckBoxField: React.FC<ExtFieldBoolean> = React.memo(
  (props) => {
    const {
      label = '',
      className = 'default-boolean-input',
      modalKey,
    } = props;
    const checkboxStyle = { fontSize: '20px', margin: '5px' };
    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    return (
      <SingleUiElementWrapper hidden={props.hidden} className={className}>
        <FieldLabel>
          {label}
          <CheckBoxFieldUi
            id={id}
            type="checkbox"
            style={props.checkboxStyle ? checkboxStyle : undefined}
            checked={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
          />
        </FieldLabel>
      </SingleUiElementWrapper>
    );
  },
);

export default CheckBoxField;
