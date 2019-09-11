import styled from 'styled-components';

export const EtsTableWrapNoScroll = styled.div`
  margin: 2.5px;
  min-height: 100px;
`;

export const EtsTableWrap = styled(EtsTableWrapNoScroll)<{ addToMinusHeight?: number, isGroupColumn?: boolean, }>`
  overflow: auto;
  max-height: ${({ addToMinusHeight }) => `calc(100vh - ${240 + (addToMinusHeight || 0)}px)`};
  padding-top: ${({ isGroupColumn }) => isGroupColumn ? '50px' : '0px' };
`;

export const EtsTable = styled.table<{ fixedWidth: boolean }>`
  margin: 0;
  border-collapse: separate;
  table-layout: ${({ fixedWidth }) => fixedWidth ? 'fixed' : 'auto'};
  border: 1px solid #c1c1c1;
  width: 100%;
`;
