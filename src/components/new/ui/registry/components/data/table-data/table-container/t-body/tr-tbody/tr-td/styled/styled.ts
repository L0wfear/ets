import styled, { css } from 'styled-components';

import { constantColor } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const redColor = css`
  color: red;
`;

export const EtsTbodyTrTd = styled.td`
  &&& {
    padding: 8px;
    border: 1px solid white;
    vertical-align: baseline;
    input {
      cursor: pointer;
    }
  }
  .col-md-12 {
    position: initial;
  }
`;

export const EtsTbodyTrTdMisionData = styled(EtsTbodyTrTd)`
  &&& {
    vertical-align: inherit;
}
`;

export const MissionInfoStatusDiv = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const GlyphiconContainer32 = styled.div<{ notFull: boolean }>`
  font-size: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ notFull }) => notFull && redColor};
`;

const cssActiveGreenButton = css`
  background-color: green !important;;
`;
const cssActiveRedButton = css`
  background-color: red !important;
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
