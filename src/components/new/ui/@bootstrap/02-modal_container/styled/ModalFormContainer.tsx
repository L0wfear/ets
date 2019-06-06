import * as React from 'react';

import styled from 'styled-components';

const timeAnimation = 0.3;

export type ModalFormContainerProps = {
  id: string;
  show: boolean;
  position?: 'center' | 'default';
};

export const ModalFormContainerStyled = styled.div<ModalFormContainerProps>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: ${({ position }) => position === 'center' ? 'center' : 'baseline'};
  overflow: auto;

  background-color: ${({ show }) => `rgba(0, 0, 0, ${show ? 0.7 : 0})`};
  transition: background-color ${timeAnimation}s;
`;

const ModalFormContainer: React.FC<ModalFormContainerProps> = React.memo(
  (props) => {
    return (
      <ModalFormContainerStyled id={props.id} position={props.position} show={props.show}>
        {props.children}
      </ModalFormContainerStyled>
    );
  },
);

export default ModalFormContainer;
