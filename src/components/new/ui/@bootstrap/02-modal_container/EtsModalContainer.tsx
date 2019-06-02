import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ClickOutHandler from 'react-onclickout';

import styled, { css } from 'styled-components';

import ModalFormContainer from './styled/ModalFormContainer';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';

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

export const ModalFormStyled = styled.div`
  width: auto;
  position: relative;
  background-color: white;
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

  position?: 'center' | 'default';                  // положение формы
};

const EtsModalContainerChild: React.FC<EtsModalContainerProps> = React.memo(
  (props) => {
    /* анимация открытия/ закрытия формы */
    const [show, setShow] = React.useState(false);

    const handleHide = React.useCallback(
      (...arg) => {
        setShow(false);
        const timeId = setTimeout(
          () => props.onHide(...arg),
          timeAnimation * 1000,
        );

        return () => clearTimeout(timeId);
      },
      [props.onHide],
    );

    React.useEffect(
      () => setShow(true),
      [],
    );
    /* анимация открытия/ закрытия формы */

    useEscapeEvent(handleHide);

    return (
      ReactDOM.createPortal(
        <div role="dialog">
          <ModalFormContainer id={props.id} position={props.position} show={show}>
            <ModalFormStyled show={show} bsSize={props.bsSize}>
              <ClickOutHandler onClickOut={props.backdrop !== 'static' ? handleHide : undefined}>
                {
                  React.useMemo(
                    () => (
                      React.Children.map(
                        props.children,
                        (child: any) => (
                          React.cloneElement(child, {
                            ...child.props,
                            onHide: handleHide,
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
