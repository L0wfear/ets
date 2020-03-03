import styled from 'styled-components';

export const MapEtsContainer = styled.div<{ width?: string; height?: string; }>`
  position: relative;
  width: ${({ width }) => width ? width : 'initial'};
  height: ${({ height }) => height ? height : '500px'};

  border: 1px solid #ccc;
`;
