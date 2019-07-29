import styled from 'styled-components';

export const AppFooterContainer = styled.footer`
  flex-shrink: 0;
  width: 100%;
  padding: 0 15px;
  background: #292929;
  color: white;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  color: white;
  z-index: 1; /* футер выше загрузки */
  >div {
    overflow: hidden;
  }
`;
