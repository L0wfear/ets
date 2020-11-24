import styled from 'styled-components';

export const appFooterHeight = 30;

export const AppFooterContainer = styled.footer`
  flex-shrink: 0;
  width: 100%;
  padding: 0 15px;
  background: #292929;
  color: white;
  display: flex;
  justify-content: space-between;
  line-height: ${`${appFooterHeight}px`};
  color: white;
  z-index: 100; /* футер выше загрузки */
  >div {
    overflow: hidden;
  }
`;
