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

  #notifications {
    position: fixed;
    z-index: 10000000;
  }
`;

export default EtsGlobalStyle;
