import * as React from 'react';
import styled from 'styled-components';
import * as Modal from 'react-bootstrap/lib/Modal';

export const ModalTitleStyled = styled(Modal.Title)``;

export type EtsModalTitleProps = any;

const EtsModalTitle: React.FC<EtsModalTitleProps> = React.memo(
  (props) => {
    return (
      <ModalTitleStyled {...props} />
    );
  },
);

export default EtsModalTitle;
