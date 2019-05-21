import { createGlobalStyle } from 'styled-components';
import {
  GlobalModalFooterCss,
  GlobalModalZIndexStyle,
} from './modal';

const EtsGlobalStyle = createGlobalStyle`
  ${GlobalModalZIndexStyle}
  ${GlobalModalFooterCss}

  html, body {
    height: 100%;
    color: #000;
  }

  .glyphicon.glyphicon-info-sign {
    position: inherit;
  }

  #notifications {
    position: fixed;
    z-index: 10000000; /* уведомления в топчик всего */
  }
`;

export default EtsGlobalStyle;
