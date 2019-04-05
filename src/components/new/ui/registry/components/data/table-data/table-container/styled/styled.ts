import styled from 'styled-components';

export const EtsTableWrap = styled.div`
  max-height: calc(100vh - 250px);
  overflow: auto;
  margin: 5px;
  min-height: 100px;
`;

export const EtsTable = styled.table<{ fixedWidth: boolean }>`
  margin: 0;
  border-collapse: separate;
  table-layout: ${({ fixedWidth }) => fixedWidth ? 'fixed' : 'auto'};
  border: 1px solid #c1c1c1;
  width: 100%;
`;
