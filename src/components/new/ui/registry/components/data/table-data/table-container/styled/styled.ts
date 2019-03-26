import styled from 'styled-components';

export const EtsTableWrap = styled.div`
  max-height: calc(100vh - 250px);
  overflow: auto;
  margin: 5px;
  height: calc(100vh - 270px);
`;

export const EtsTable = styled.table`
  margin: 0;
  border-collapse: separate;
  table-layout: auto !important;
  border: 1px solid #c1c1c1;
`;
