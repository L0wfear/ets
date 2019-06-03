import * as React from 'react';
import styled from 'styled-components';

export const ModalFooterStyled = styled.div.attrs({
  className: 'modal_footer',
})`
  background-color: #e9f0f5;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export type EtsModalFooterProps = {
  onHide?: (...arg: any[]) => any;
};

const EtsModalFooter: React.FC<EtsModalFooterProps> = React.memo(
  (props) => {
    return (
      <ModalFooterStyled {...props} />
    );
  },
);

export default EtsModalFooter;
