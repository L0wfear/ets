import * as React from 'react';
import cx from 'classnames';

import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { NumberFieldUi } from 'components/@next/@ui/renderFields/NumberField/styled';
import { ExtFieldNumber } from 'components/@next/@ui/renderFields/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const NumberField: React.FC<ExtFieldNumber> = React.memo(
  (props) => {
    const { error, modalKey, showRedBorder, addonRight, ...mainProps } = props;

    const inputClassName = cx({ 'has-error': error || showRedBorder });
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
          {
            addonRight
              ? (
              <EtsBootstrap.InputGroup>
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
                </EtsBootstrap.InputGroup>
              )
              :
              (
                <NumberFieldUi
                  lang="en"
                  type="number"
                  className={inputClassName}
                  {...mainProps}
                  id={value_id}
                  value={value}
                />
              )
          }

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
