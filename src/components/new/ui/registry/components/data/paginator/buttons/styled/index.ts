import styled from 'styled-components';

import { mobiSize } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const ButtonPaginatorWrap = styled(EtsBootstrap.Button)`
  min-height: 33px;
  @media screen and (max-width: ${mobiSize}px) {
    display: block;
    width: 100%;
  }
`;
