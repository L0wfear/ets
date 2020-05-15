import * as React from 'react';
import cx from 'classnames';

import Div from 'components/old/ui/Div';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';
import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled/index';
import { StringFieldUi } from 'components/@next/@ui/renderFields/StringField/styled';
import { ExtFieldString } from 'components/@next/@ui/renderFields/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ThOverlayTrigger } from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThDefault';

const StringField: React.FC<ExtFieldString> = React.memo(
  (props) => {
    const {
      error,
      label = '',
      modalKey,
      isLoading,
      inline,
      ...mainProps
    } = props;

    const {
      readOnly = false,
      disabled = false,
      className = '',
      wrapStyle,
      hidden,
      addonRight,
    } = props;
    let { value } = props;

    const inputClassName = cx({ 'has-error': error });
    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;
    const value_id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-value`
      : undefined;

    if (isLoading) {
      return (
        <Div hidden={hidden}>
          {typeof props.label === 'string' && (
            <FieldLabel style={{ paddingTop: 5 }} id={id}>
              {label}
            </FieldLabel>
          )}
          )
          <br />
          <PreloadNew typePreloader="field" />
        </Div>
      );
    }

    if (value === undefined || value === null) {
      value = '';
    }
    const showError = typeof error === 'boolean' ? error : true;

    return !readOnly ? (
      <SingleUiElementWrapper hidden={hidden} style={wrapStyle || {}}>
        {/* Выпилить отовсюду form-group */}
        <div className="form-group">
          {typeof props.label === 'string' && (
            <FieldLabel className="control-label" id={id} htmlFor={value_id}>
              <span>{label}</span>
            </FieldLabel>
          )}
          <EtsBootstrap.InputGroup.Group has_right_addon={Boolean(addonRight)}>
            <StringFieldUi
              type="text"
              disabled={disabled}
              className={inputClassName}
              {...mainProps}
              id={value_id}
              value={value}
            />
            { 
              props.fieldPopup
            && (<ThOverlayTrigger>
              <EtsBootstrap.OverlayTrigger
                trigger={['hover', 'focus']}
                overlay={(
                  <EtsBootstrap.Popover>
                    {props.fieldPopup}
                  </EtsBootstrap.Popover>
                )}
                placement="bottom">
                <EtsBootstrap.Glyphicon glyph="info-sign" />
              </EtsBootstrap.OverlayTrigger>
            </ThOverlayTrigger>)
            }
            {
              addonRight && (
                <EtsBootstrap.InputGroup.Addon>
                  {addonRight}
                </EtsBootstrap.InputGroup.Addon>
              )
            }
          </EtsBootstrap.InputGroup.Group>
        </div>
        <ErrorsBlock
          showError={showError}
          hidden={!error}
          error={error}
        />
      </SingleUiElementWrapper>
    ) : (
      <SingleUiElementWrapper hidden={hidden} className={className}>
        {typeof props.label === 'string' && (
          <FieldLabel style={{ paddingTop: 5, paddingRight: 5 }} htmlFor={value_id}>
            {label}
          </FieldLabel>
        )}
        {!inline && <br />}
        <span id={value_id}>{value}</span>
      </SingleUiElementWrapper>
    );
  });

export default StringField;
