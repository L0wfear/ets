import * as React from 'react';
import { createPortal } from 'react-dom';

import styled, { css } from 'styled-components';

import ModalFormContainer from './styled/ModalFormContainer';
import useEscapeEvent from 'components/new/utils/hooks/useEscapeEvent/useEscapeEvent';
import themeModal from '../@themes/default/modal/themeModal';
import { ModalBodyStyled } from 'components/new/ui/@bootstrap/08-modal_body/EtsModalBody';

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

const bsSizeMediumCss = css`
  @media screen and (min-width: 990px) {
    width: 500px;
  }
  @media screen and (min-width: 1240px) {
    width: 900px;
  }
  @media screen and (min-width: 1540px) {
    width: 900px;
  }
`;

export const ModalFormStyled = styled.div<{ show: boolean; bsSize?: 'large' | 'small' | 'medium'; noPadding?: boolean; }>`
  width: 95%;
  position: relative;
  margin-bottom: 300px;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;

  pointer-events: ${({ show }) => !show ? 'none' : 'all'};

  opacity: ${({ show }) => !show ? 0 : 1};

  ${ModalBodyStyled} {
    padding: ${({ noPadding }) => noPadding ? '0' : '15px'};
  }
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
  ${({ bsSize }) => bsSize === 'medium' && bsSizeMediumCss}
`;

export type EtsModalContainerProps = {
  id: string;                                       // ясно понятно
  show: boolean;                                    // ясно понятно
  onHide?: (...arg: Array<any>) => any;                   // ясно понятно
  bsSize?: 'large' | 'small' | 'medium';            // размер формы | small - дефолт
  themeName?: keyof typeof themeModal;
  noPadding?: boolean;

  position?: 'center' | 'default';                  // положение формы
};

const EtsModalContainerChild: React.FC<EtsModalContainerProps> = React.memo(
  (props) => {
    const handleHide = React.useCallback(
      (...arg) => {
        if (props.onHide) {
          props.onHide(...arg);
        }
      },
      [props.onHide],
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
      createPortal(
        <div role="dialog" onDoubleClick={handleDoubleClick}>
          <ModalFormContainer id={props.id} position={props.position} show>
            <ModalFormStyled show bsSize={props.bsSize} noPadding={props.noPadding}>
              {
                React.useMemo(
                  () => (
                    React.Children.map(
                      props.children,
                      (child: any) => (
                        React.isValidElement(child) && React.cloneElement(child, {
                          ...(child.props as any),
                          onHide: props.onHide,
                          themeName: props.themeName || 'default',
                        })
                      ),
                    )
                  ),
                  [props.children, handleHide],
                )
              }
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
