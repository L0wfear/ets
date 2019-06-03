import * as React from 'react';
import styled from 'styled-components';

export const ModalBodyStyled = styled.div.attrs({
  className: 'modal_body',
})`
  position: relative;
  padding: 15px;
`;

export type EtsModalBodyProps = {
  onHide?: (...arg: any[]) => any;
};

const EtsModalBody: React.FC<EtsModalBodyProps> = React.memo(
  (props) => {
    return (
      <ModalBodyStyled {...props} />
    );
  },
);

export default EtsModalBody;
