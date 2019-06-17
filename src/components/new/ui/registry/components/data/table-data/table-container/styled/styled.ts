import styled from 'styled-components';

export const EtsTableWrapNoScroll = styled.div`
  margin: 5px;
  min-height: 100px;
`;

export const EtsTableWrap = styled(EtsTableWrapNoScroll)<{ addToMinusHeight?: number }>`
  overflow: auto;
  max-height: ${({ addToMinusHeight }) => `calc(100vh - ${250 + (addToMinusHeight || 0)}px)`};
`;

export const EtsTable = styled.table<{ fixedWidth: boolean }>`
  margin: 0;
  border-collapse: separate;
  table-layout: ${({ fixedWidth }) => fixedWidth ? 'fixed' : 'auto'};
  border: 1px solid #c1c1c1;
  width: 100%;
`;
