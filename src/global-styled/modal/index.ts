import { css } from 'styled-components';

export const GlobalModalZIndexStyle = css`
  div[role='dialog'] {
    position: fixed;
    z-index: 1000000; /* фон модалки */
  }

  div#notifications {
    position: fixed;
    z-index: 10000000; /* модалка выше всего */
  }
`;

export const GlobalModalFooterCss = css`
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: left;

    &>* {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;
