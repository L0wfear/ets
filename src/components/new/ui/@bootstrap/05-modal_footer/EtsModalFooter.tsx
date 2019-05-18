import * as React from 'react';
import styled from 'styled-components';
import * as Modal from 'react-bootstrap/lib/Modal';

export const ModalFooterStyled = styled(Modal.Footer)``;

export type EtsModalFooterProps = any;

const EtsModalFooter: React.FC<EtsModalFooterProps> = React.memo(
  (props) => {
    return (
      <ModalFooterStyled {...props} />
    );
  },
);

export default EtsModalFooter;
