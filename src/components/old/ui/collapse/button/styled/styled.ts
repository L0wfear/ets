import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const GlyphiconCollapseButtonWrap = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  padding-top: 10px;

  transform: ${({ isOpen }) => isOpen ? 'rotateX(180deg) translateY(-50%)' : 'initial'};

  .glyphicon {
    cursor: pointer;
  }
`;

export const GlyphiconPointer = styled(EtsBootstrap.Glyphicon)`
  cursor: pointer;
`;
