import styled from 'styled-components';
import { lighten } from 'polished';

import { CommonDisplayContent, CommonTdTh } from 'components/new/ui/@bootstrap/grid_bootstrap/common';

type Props = {
  table_width: number;
  fields: Array<{
    width?: number;
    [k: string]: any;
  }>
};

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

const EtsTheadTr = styled.div<Props>`
  ${CommonDisplayContent};

  display: grid;
  display: -ms-grid;
  border-collapse: collapse;
  min-width: 100%;
  -ms-grid-columns: ${({ table_width, fields }) => {
    // const table_width = fields.reduce((summ, { width }) => summ + (width || 150), 0);

    return fields.reduce(
      (str, { width }) => `${str}
        minmax(${width || 150}px, ${(width || 150) / (table_width / fields.length)}fr)`,
      '',
    );
  }};
  grid-template-columns: ${({ table_width, fields }) => {
    // const table_width = fields.reduce((summ, { width }) => summ + (width || 150), 0);

    return fields.reduce(
      (str, { width }) => `${str}
        minmax(${width || 150}px, ${(width || 150) / (table_width / fields.length)}fr)`,
      '',
    );
  }};
`;

const GridBootstrapThead = {
  Thead: EtsThead,
  Tr: EtsTheadTr,
  Th: EtsTheadTh,
};

export default GridBootstrapThead;
