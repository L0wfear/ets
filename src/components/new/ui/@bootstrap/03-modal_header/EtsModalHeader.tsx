import * as React from 'react';
import styled from 'styled-components';
import * as Modal from 'react-bootstrap/lib/Modal';

export const ModalHeaderStyled = styled(Modal.Header)``;

export type EtsModalHeaderProps = {
  closeButton?: boolean;
};

const EtsModalHeader: React.FC<EtsModalHeaderProps> = React.memo(
  (props) => {
    return (
      <ModalHeaderStyled {...props} />
    );
  },
);

export default EtsModalHeader;
