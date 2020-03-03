import styled from 'styled-components';

export const LegenCompanyLegendOption = styled.div.attrs({ className: 'legen_option' })`
  cursor: default;
  justify-content: space-between;
`;

export const CubeColor = styled.div<{ backgroundColor: string; }>`
  width: 20px;
  height: 10px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;
