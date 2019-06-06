import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ClickOutHandler from 'react-onclickout';

import styled, { css } from 'styled-components';

import ModalFormContainer from './styled/ModalFormContainer';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import themeModal from '../@themes/default/modal/themeModal';

const timeAnimation = 0.3;

const bsSizeLargeCss = css`
  @media screen and (min-width: 990px) {
    width: 900px;
  }
  @media screen and (min-width: 1240px) {
    width: 1240px;
  }
  @media screen and (min-width: 1540px) {
    width: 1440px;
  }
`;

export const ModalFormStyled = styled.div<{ show: boolean; bsSize?: 'large' | 'small' }>`
  width: auto;
  position: relative;
  margin-bottom: 300px;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  pointer-events: ${({ show }) => !show ? 'none' : 'all'};

  opacity: ${({ show }) => !show ? 0 : 1};
  transform: ${({ show }) => `translate(0, ${!show ? '-100%' : '0'})`};
  transition: opacity ${timeAnimation}s, transform ${timeAnimation}s;
  will-change: transform, opacity;

  @media screen and (max-width: 768px) {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }

  @media screen and (min-width: 768px) {
    width: 600px;
  }

  ${({ bsSize }) => bsSize === 'large' && bsSizeLargeCss}
`;

export type EtsModalContainerProps = {
  id: string;                                       // ясно понятно
  show: boolean;                                    // ясно понятно
  onHide: (...arg: any[]) => any;                   // ясно понятно
  bsSize?: 'large' | 'small';                       // размер формы | small - дефолт
  backdrop?: 'static';                              // можно ли закрыти форму кликом вне
  themeName?: keyof typeof themeModal;

  position?: 'center' | 'default';                  // положение формы
};

const EtsModalContainerChild: React.FC<EtsModalContainerProps> = React.memo(
  (props) => {
    const handleHide = React.useCallback(
      (...arg) => {
        props.onHide(...arg);
      },
      [props.onHide],
    );

    const handleHideContainer = React.useCallback(
      (...arg) => {
        if (props.backdrop !== 'static') {
          handleHide();
        }
      },
      [handleHide, props.backdrop],
    );

    useEscapeEvent(handleHide);

    const handleDoubleClick = React.useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      [],
    );

    return (
      ReactDOM.createPortal(
        <div role="dialog" onDoubleClick={handleDoubleClick}>
          <ModalFormContainer id={props.id} position={props.position} show>
            <ModalFormStyled show bsSize={props.bsSize}>
              <ClickOutHandler onClickOut={handleHideContainer}>
                {
                  React.useMemo(
                    () => (
                      React.Children.map(
                        props.children,
                        (child: any) => (
                          React.cloneElement(child, {
                            ...child.props,
                            onHide: props.onHide,
                            themeName: props.themeName || 'default',
                          })
                        ),
                      )
                    ),
                    [props.children, handleHide],
                  )
                }
              </ClickOutHandler>
            </ModalFormStyled>
          </ModalFormContainer>
        </div>,
        document.getElementById('modal_container'),
      )
    );
  },
);

const EtsModalContainer: React.FC<EtsModalContainerProps> = React.memo(
  (props) => {
    return props.show && (
      <EtsModalContainerChild {...props} />
    );
  },
);

export default EtsModalContainer;
