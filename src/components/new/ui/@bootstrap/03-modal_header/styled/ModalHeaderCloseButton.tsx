import * as React from 'react';

import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const ModalHeaderCloseButtonStyled = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  line-height: 1.2;

  opacity: 0.2;
  color: black;
  transition: opacity 0.3s, color 0.3s;
  will-change: opacity;

  :hover {
    opacity: 1;
    color: ${UiConstants.colorError};
  }
`;

export type ModalHeaderCloseButtonProps = {
  onHide: (...arg: any[]) => any;
};

const ModalHeaderCloseButton: React.FC<ModalHeaderCloseButtonProps> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      () => {
        props.onHide(false);
      },
      [props.onHide],
    );
    return (
      <ModalHeaderCloseButtonStyled type="button" onClick={handleClick}>
        ×
      </ModalHeaderCloseButtonStyled>
    );
  },
);

export default ModalHeaderCloseButton;
