import styled, { css } from 'styled-components';

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
