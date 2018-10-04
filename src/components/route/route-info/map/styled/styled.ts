import styled from 'styled-components';

export const MapEtsContainer = styled<{ width?: string, height?: string }, 'div'>('div')`
  position: relative;
  width: ${({ width }) => width ? width : 'initial'};
  height: ${({ height }) => height ? height : '500px'};

  border: 1px solid #ccc;
  margin-right: 10px;
`;
