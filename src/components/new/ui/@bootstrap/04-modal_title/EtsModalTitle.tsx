import * as React from 'react';
import styled from 'styled-components';

export const ModalTitleStyled = styled.h4`
  margin: 0;
`;

export type EtsModalTitleProps = {
  onHide?: (...arg: any) => any;
};

const EtsModalTitle: React.FC<EtsModalTitleProps> = React.memo(
  (props) => {
    return (
      <ModalTitleStyled>
        {props.children}
      </ModalTitleStyled>
    );
  },
);

export default EtsModalTitle;
