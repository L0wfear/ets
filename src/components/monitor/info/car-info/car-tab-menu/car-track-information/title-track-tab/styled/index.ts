import styled, { css } from 'styled-components';

const disabledCss = css`
  color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
  pointer-events: none;
`;

export const CarInfoToggleForToday = styled.div`
  cursor: pointer;

  &&& {
    input {
      margin-right: 5px;
    }
  }

  ${({ isDisabled }) => (
    isDisabled && disabledCss
  )};
`;
