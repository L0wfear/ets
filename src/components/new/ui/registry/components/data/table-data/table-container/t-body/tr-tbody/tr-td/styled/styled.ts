import styled, { css } from 'styled-components';

import { constantColor } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const redColor = css`
  color: red;
`;

export const EtsTbodyScrollContainer = styled.div`
  max-height: 120px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #4c4c4c;
    opacity: 1;
  }
`;

export const EtsTbodyTextContainer = styled.div`
  pointer-events: none;
`;

export const EtsTdInnerWrapper = styled.div`
  display: block;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

export const EtsTbodyTrTd = styled.td`
  &&& {
    padding: 8px;
    border: 1px solid white;
    vertical-align: top;

    word-break: break-word;
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
