import styled from 'styled-components';

type Props = {
  table_width: number;
  fields: Array<{
    width?: number;
    [k: string]: any;
  }>
};

export const EtsGridTable = styled.div<Props>`
  &&& {
    display: -ms-grid;
    display: grid;
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
  }
`;
