import { createGlobalStyle } from 'styled-components';
import {
  GlobalModalFooterCss,
  GlobalModalZIndexStyle,
  GlobalDropupCss,
} from './modal';

const EtsGlobalStyle = createGlobalStyle`
  ${GlobalModalZIndexStyle}
  ${GlobalModalFooterCss}
  ${GlobalDropupCss}

  .glyphicon.glyphicon-info-sign {
    position: inherit;
  }

  #notifications {
    position: fixed;
    z-index: 10000000; /* уведомления в топчик всего */
  }
`;

export default EtsGlobalStyle;
