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
    display: grid;
    display: -ms-grid;
    border-collapse: collapse;
    min-width: 100%;
  }
`;
