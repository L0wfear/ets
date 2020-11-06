import * as React from 'react';
import cx from 'classnames';

import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { NumberFieldUi } from 'components/@next/@ui/renderFields/NumberField/styled';
import { ExtFieldNumber } from 'components/@next/@ui/renderFields/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import WarningBlock from 'components/@next/@ui/renderFields/WarningBlock/WarningBlock';

const NumberField: React.FC<ExtFieldNumber> = React.memo(
  (props) => {
    const { error, warning, modalKey, showRedBorder, addonRight, ...mainProps } = props;

    const inputClassName = cx({ 'has-error': error || showRedBorder || warning });
    let { value } = props;

    if (value === undefined || value === null) {
      value = '';
    }

    const label_id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;
    const value_id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-value`
      : undefined;

    return (
      <SingleUiElementWrapper hidden={props.hidden}>
        <div className="form-group">
          {typeof props.label === 'string' && (
            <FieldLabel className="control-label" id={label_id}>
              <span>{props.label}</span>
            </FieldLabel>
          )}
          <EtsBootstrap.InputGroup.Group has_right_addon={Boolean(addonRight)}>
            <NumberFieldUi
              lang="en"
              type="number"
              className={inputClassName}
              {...mainProps}
              id={value_id}
              value={value}
            />
            {
              addonRight && (
                <EtsBootstrap.InputGroup.Addon>
                  {addonRight}
                </EtsBootstrap.InputGroup.Addon>
              )
            }
          </EtsBootstrap.InputGroup.Group>
        </div>
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

export default NumberField;
