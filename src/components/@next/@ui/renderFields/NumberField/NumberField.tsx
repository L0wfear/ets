import * as React from 'react';
import cx from 'classnames';

import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { NumberFieldUi } from 'components/@next/@ui/renderFields/NumberField/styled';
import { ExtFieldNumber } from 'components/old/ui/new/field/ExtField';

const NumberField: React.FC<ExtFieldNumber> = React.memo(
  (props) => {
    const { error, modalKey, showRedBorder, ...mainProps } = props;

    const inputClassName = cx({ 'has-error': error || showRedBorder });
    let { value } = props;

    if (value === undefined || value === null) {
      value = '';
    }

    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    return (
      <SingleUiElementWrapper hidden={props.hidden}>
        <div className="form-group">
          {typeof props.label === 'string' && (
            <FieldLabel className="control-label">
              <span>{props.label}</span>
            </FieldLabel>
          )}
          <NumberFieldUi
            lang="en"
            type="number"
            className={inputClassName}
            {...mainProps}
            id={id}
            value={value}
          />
        </div>
        <ErrorsBlock
          hidden={!error}
          error={error}
        />
      </SingleUiElementWrapper>
    );
  },
);

export default NumberField;
