import { css } from 'styled-components';

const GlobalModalZIndexStyle = css`
  div[role='dialog'] {
    position: fixed;
    z-index: 1000000;
  }

  div#notifications {
    position: fixed;
    z-index: 10000000;
  }
`;

export default GlobalModalZIndexStyle;
