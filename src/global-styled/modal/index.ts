import { css } from 'styled-components';

export const GlobalModalZIndexStyle = css`
  div[role='dialog'] {
    position: fixed;
    z-index: 1000000;
  }

  div#notifications {
    position: fixed;
    z-index: 10000000;
  }
`;

export const GlobalModalFooterCss = css`
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: left;

    &>* {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export const GlobalDropupCss = css`
  .dropup>button.btn {
    border-radius: 3px;
  }
`;
