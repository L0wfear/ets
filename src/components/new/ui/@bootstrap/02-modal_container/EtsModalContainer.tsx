import * as React from 'react';
import styled from 'styled-components';
import * as Modal from 'react-bootstrap/lib/Modal';

export const ModalStyled = styled(Modal)``;

type EtsModalContainerProps = any;

const EtsModalContainer: React.FC<EtsModalContainerProps> = React.memo(
  (props) => {
    const handleDoubleClick = React.useCallback(
      (event) => {
        event.stopPropagation();
      },
      [],
    );

    return (
      <ModalStyled {...props}>
        <div onDoubleClick={handleDoubleClick}>
          {props.children}
        </div>
      </ModalStyled>
    );
  },
);

export default EtsModalContainer;
