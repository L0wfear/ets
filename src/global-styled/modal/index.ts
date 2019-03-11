import { css } from 'styled-components';

const GlobalModalZIndexStyle = css`
  div[role='dialog'] {
    position: fixed;
    z-index: 1000000;
  }
`;

export default GlobalModalZIndexStyle;
