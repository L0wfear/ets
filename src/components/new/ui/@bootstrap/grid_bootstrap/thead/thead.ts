import styled from 'styled-components';
import { lighten } from 'polished';

import { CommonDisplayContent, CommonTdTh } from 'components/new/ui/@bootstrap/grid_bootstrap/common';

const EtsThead = styled.div`
  ${CommonDisplayContent};
`;

const EtsTheadTh = styled.div<{ canClick?: boolean; }>`
  ${CommonTdTh};
  position: sticky;
  top: 0;
  text-align: left;

  vertical-align: middle;
  background-color: #eee;

  font-weight: bold;
  border: 1px solid white;
  border-top: 1px solid #c1c1c1;
  border-bottom: 1px solid #c1c1c1;
  :first-child {
    border-left: 1px solid #c1c1c1;
  }
  :last-child {
    border-right: 1px solid #c1c1c1;
  }

  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ canClick }) => canClick ? lighten(0.04, '#eee') : '#eee'};
  }

  cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
  input {
    cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
  }
`;

const EtsTheadTr = styled.div`
  ${CommonDisplayContent};
`;

const GridBootstrapThead = {
  Thead: EtsThead,
  Tr: EtsTheadTr,
  Th: EtsTheadTh,
};

export default GridBootstrapThead;
