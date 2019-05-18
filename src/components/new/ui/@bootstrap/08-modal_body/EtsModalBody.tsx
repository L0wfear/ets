import * as React from 'react';
import styled from 'styled-components';
import * as Modal from 'react-bootstrap/lib/Modal';

export const ModalBodyStyled = styled(Modal.Body)``;

type EtsModalBodyProps = any;

const EtsModalBody: React.FC<EtsModalBodyProps> = React.memo(
  (props) => {
    return (
      <ModalBodyStyled {...props} />
    );
  },
);

export default EtsModalBody;
