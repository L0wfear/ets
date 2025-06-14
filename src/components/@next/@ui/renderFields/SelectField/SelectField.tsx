import * as React from 'react';
import cx from 'classnames';
import { isString } from 'util';

import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { SelectFieldUi } from 'components/@next/@ui/renderFields/SelectField/styled';
import { ExtFieldSelect } from 'components/@next/@ui/renderFields/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import WarningBlock from 'components/@next/@ui/renderFields/WarningBlock/WarningBlock';

export const SpaceWrapper = styled.span`
`;

const SelectField: React.FC<ExtFieldSelect> = React.memo(
  (props) => {
    const { label = '', ...selectProps } = props;
    const { error, warning, portal, setIsClickMenu, className = '', readOnly = false, modalKey } = props;

    const selectClassName = cx({ 'has-error': error || warning });
    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    return (
      <SingleUiElementWrapper
        hidden={props.hidden}
        className={className}
      >
        {
          isString(label) && (
            <React.Fragment>
              <FieldLabel id={id}>
                {label}
                <SpaceWrapper>
                  &nbsp;
                </SpaceWrapper>
              </FieldLabel>
              {
                props.hint && (
                  <EtsBootstrap.OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={(
                      <EtsBootstrap.Popover>
                        {props.hint}
                      </EtsBootstrap.Popover>
                    )}
                    placement="top"
                  >
                    <EtsBootstrap.Glyphicon glyph="info-sign"/>
                  </EtsBootstrap.OverlayTrigger>
                )
              }
            </React.Fragment>
          )
        }
        <SelectFieldUi
          {...selectProps}
          disabled={readOnly || props.disabled}
          className={selectClassName}
          portal={portal}
          setIsClickMenu={setIsClickMenu}
        />
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

export default SelectField;
