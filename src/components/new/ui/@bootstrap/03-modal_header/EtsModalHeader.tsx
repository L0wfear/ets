import * as React from 'react';
import styled from 'styled-components';
import ModalHeaderCloseButton from './styled/ModalHeaderCloseButton';

export const ModalHeaderStyled = styled.div`
  background-color: #e9f0f5;
  min-height: 16.43px;
  padding: 15px;

  display: flex;
  justify-content: space-between;

  align-items: baseline;
`;

export type EtsModalHeaderProps = {
  closeButton?: boolean;
  onHide?: (...arg: any) => any;
};

const EtsModalHeader: React.FC<EtsModalHeaderProps> = React.memo(
  (props) => {
    return (
      <ModalHeaderStyled>
        { props.children }
        { Boolean(props.closeButton) && <ModalHeaderCloseButton onHide={props.onHide} /> }
      </ModalHeaderStyled>
    );
  },
);

export default EtsModalHeader;
