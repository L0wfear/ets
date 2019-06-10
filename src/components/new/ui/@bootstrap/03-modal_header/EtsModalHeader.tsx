import * as React from 'react';
import styled from 'styled-components';
import ModalHeaderCloseButton from './styled/ModalHeaderCloseButton';
import themeModal from '../@themes/default/modal/themeModal';

export const ModalHeaderStyled = styled.div<{ themeName?: keyof typeof themeModal }>`
  transition: all 0.5s;

  background-color: ${({ theme, themeName }) => theme.modal[themeName || 'default'].backgroundColor.header.default };
  padding: ${({ theme, themeName }) => theme.modal[themeName || 'default'].padding.header.default };
  border-top-left-radius: ${({ theme, themeName }) => theme.modal[themeName || 'default'].borderRadius.header.default };
  border-top-right-radius: ${({ theme, themeName }) => theme.modal[themeName || 'default'].borderRadius.header.default };

  display: flex;
  justify-content: space-between;

  align-items: baseline;
`;

export type EtsModalHeaderProps = {
  closeButton?: boolean;
  onHide?: (...arg: any) => any;
  themeName?: keyof typeof themeModal;
};

const EtsModalHeader: React.FC<EtsModalHeaderProps> = React.memo(
  (props) => {
    return (
      <ModalHeaderStyled themeName={props.themeName}>
        { props.children }
        { Boolean(props.closeButton) && <ModalHeaderCloseButton onHide={props.onHide} /> }
      </ModalHeaderStyled>
    );
  },
);

export default EtsModalHeader;
