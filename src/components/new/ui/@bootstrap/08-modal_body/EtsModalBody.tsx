import * as React from 'react';
import styled from 'styled-components';
import themeModal from '../@themes/default/modal/themeModal';

export const ModalBodyStyled = styled.div<{ themeName: keyof typeof themeModal; }>`
  transition: all 0.5s;

  position: relative;
  background-color: ${({ theme, themeName }) => theme.modal[themeName || 'default'].backgroundColor.body.default };
  padding: ${({ theme, themeName }) => theme.modal[themeName || 'default'].padding.body.default };
`;

export type EtsModalBodyProps = {
  onHide?: (...arg: Array<any>) => any;
  themeName?: keyof typeof themeModal;
};

const EtsModalBody: React.FC<EtsModalBodyProps> = React.memo(
  (props) => {
    return (
      <ModalBodyStyled themeName={props.themeName} className="modal-body">
        {props.children}
      </ModalBodyStyled>
    );
  },
);

export default EtsModalBody;
