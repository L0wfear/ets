import styled from 'styled-components';

export const GlyphiconCollapseButtonWrap = styled.div<{ isOpen: boolean; }>`
  display: flex;
  justify-content: center;
  padding: 10px 0;
  transition: transform 0.3s;
  transform: ${({ isOpen }) => isOpen ? 'scale(1.0, -1.0)' : 'initial'};
`;
