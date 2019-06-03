import * as React from 'react';
import styled from 'styled-components';
import themeModal from '../@themes/default/modal/themeModal';

export const ModalFooterStyled = styled.div.attrs({
  className: 'modal_footer',
})`
  background-color: ${({ theme, themeName }) => theme.modal[themeName || 'default'].backgroundColor.footer.default };
  padding: ${({ theme, themeName }) => theme.modal[themeName || 'default'].padding.footer.default };
  border-bottom-left-radius: ${({ theme, themeName }) => theme.modal[themeName || 'default'].borderRadius.footer.default };
  border-bottom-right-radius: ${({ theme, themeName }) => theme.modal[themeName || 'default'].borderRadius.footer.default };

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export type EtsModalFooterProps = {
  onHide?: (...arg: any[]) => any;
  themeName?: keyof typeof themeModal;
};

const EtsModalFooter: React.FC<EtsModalFooterProps> = React.memo(
  (props) => {
    return (
      <ModalFooterStyled themeName={props.themeName}>
        {props.children}
      </ModalFooterStyled>
    );
  },
);

export default EtsModalFooter;
