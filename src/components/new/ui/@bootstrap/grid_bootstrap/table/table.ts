import styled from 'styled-components';

type Props = {
  table_width: number;
  fields: Array<{
    width?: number;
    [k: string]: any;
  }>
};

export const EtsGridTable = styled.table<Props>`
  &&& {
    display: grid;
    border-collapse: collapse;
    min-width: 100%;
    grid-template-columns: ${({ table_width, fields }) => {
      // const table_width = fields.reduce((summ, { width }) => summ + (width || 150), 0);

      return fields.reduce(
        (str, { width }) => `${str}
          minmax(${width || 150}px, ${(width || 150) / (table_width / fields.length)}fr)`,
        '',
      );
    }};

    thead,
    tbody,
    tr {
      display: contents;
    }
    th, td {
      padding: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    tbody > tr {
      transition: translate 0.1s;
      :hover {
        translate: scale(1.01. 1.01) transform(-1%);
      }
    }

    th {
      position: sticky;
      top: 0;
      text-align: left;
    }

    th:last-child {
      border: 0;
    }
  }
`;
