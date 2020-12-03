import styled from 'styled-components';

export const EtsTableWrapNoScroll = styled.div`
  margin: 2.5px;
  min-height: 100px;
`;

export const EtsTableWrap = styled(EtsTableWrapNoScroll)<{ addToMinusHeight?: number; isGroupColumn?: boolean; scrollYPos?: number; }>`
  overflow: auto;
  max-height: ${({ addToMinusHeight }) => `calc(100vh - ${240 + (addToMinusHeight || 0)}px)`};
  padding-top: ${({ isGroupColumn, scrollYPos }) => isGroupColumn ? `${50 - scrollYPos}px` : '0px' };
  transition: all .5s ease;
`;

export const EtsTable = styled.table<{ fixedWidth: boolean; id: string; }>`
  margin: 0;
  border-collapse: separate;
  table-layout: ${({ fixedWidth }) => fixedWidth ? 'fixed' : 'auto'};
  border: 1px solid #c1c1c1;
  width: 100%;
`;
