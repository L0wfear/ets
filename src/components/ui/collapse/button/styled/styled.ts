import styled from 'styled-components';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

export const GlyphiconCollapseButtonWrap = styled<{ isOpen: boolean }, 'div'>('div')`
  display: flex;
  justify-content: center;
  padding-top: 10px;

  transform: ${({ isOpen }) => isOpen ? 'rotateX(180deg) translateY(-50%)' : 'initial'};

  .glyphicon {
    cursor: pointer;
  }
`;

export const GlyphiconPointer = styled(Glyphicon)`
  cursor: pointer;
`;