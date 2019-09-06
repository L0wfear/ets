import styled, { css } from 'styled-components';

import { constantColor } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

const cssActiveGreenButton = css`
  background-color: green !important;;
`;
const cssActiveRedButton = css`
  background-color: ${UiConstants.colorError} !important;
`;
const cssNotActiveButton = css`
  background-color: ${constantColor.colorGray} !important;;
`;

export const ButtonGreenActive = styled(EtsBootstrap.Button)`
  &&& {
    ${({ active }) => active ? cssActiveGreenButton : cssNotActiveButton}
  }
`;

export const ButtonRedActive = styled(EtsBootstrap.Button)`
  &&& {
    ${({ active }) => active ? cssActiveRedButton : cssNotActiveButton}
  }
`;
