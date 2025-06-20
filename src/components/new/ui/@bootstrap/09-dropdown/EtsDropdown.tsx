import * as React from 'react';
import styled from 'styled-components';
import * as ClickOutHandler from 'react-onclickout';
import EtsButton, { EtsButtonProps } from '../00-button/EtsButton';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export type OverlayTriggerConfig = {
  triger: Array<'hover' | 'focus' | 'click'>;
  placement: string;
  overlay: JSX.Element;
};

export type EtsDropdownProps = {
  id?: string;
  toggleElement: any;
  toggleElementSize?: EtsButtonProps['bsSize'];
  title?: EtsButtonProps['title'];
  noCaret?: boolean;
  disabled?: boolean;
  dropup?: boolean;
  overlayTrigger?: OverlayTriggerConfig;
  className?: string;
};

export const EtsDropdownContainer = styled.div`
  position: relative;
`;

const EtsDropdownCaretContainer = styled.span`
  margin-left: 5px;
  font-size: 10px;
`;

const EtsDropdown: React.FC<EtsDropdownProps> = React.memo(
  (props) => {
    const {overlayTrigger} = props;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = React.useCallback(
      () => {
        setIsOpen((state) => !state);
      },
      [],
    );

    const handleClickClose = React.useCallback(
      () => {
        if (isOpen) {
          setIsOpen(false);
        }
      },
      [isOpen],
    );

    let glyphDirection = !isOpen;
    if (props.dropup) {
      glyphDirection = !glyphDirection;
    }

    return (
      <EtsDropdownContainer>
        <ClickOutHandler onClickOut={handleClickClose}>
          {overlayTrigger
            ? <EtsBootstrap.OverlayTrigger trigger={overlayTrigger.triger} placement={overlayTrigger.placement} overlay={overlayTrigger.overlay}>
              <EtsButton bsSize={props.toggleElementSize} disabled={props.disabled} onClick={handleClick} title={props.title}>
                {props.toggleElement}
                {
                  !props.noCaret && (
                    <EtsDropdownCaretContainer>
                      <EtsBootstrap.Glyphicon
                        glyph={
                          glyphDirection
                            ? 'triangle-bottom'
                            : 'triangle-top'}
                      />
                    </EtsDropdownCaretContainer>
                  )
                }
              </EtsButton>
            </EtsBootstrap.OverlayTrigger>
            :            <EtsButton bsSize={props.toggleElementSize} disabled={props.disabled} onClick={handleClick} title={props.title}>
              {props.toggleElement}
              {
                !props.noCaret && (
                  <EtsDropdownCaretContainer>
                    <EtsBootstrap.Glyphicon
                      glyph={
                        glyphDirection
                          ? 'triangle-bottom'
                          : 'triangle-top'}
                    />
                  </EtsDropdownCaretContainer>
                )
              }
            </EtsButton>
          }
        </ClickOutHandler>
        {
          isOpen
            && props.children
        }
      </EtsDropdownContainer>
    );
  },
);

export default EtsDropdown;
