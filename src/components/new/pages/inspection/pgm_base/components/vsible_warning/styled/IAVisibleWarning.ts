import styled from 'styled-components';

export const IAVisibleWarningInputContainer = styled.div<{ sub?: number }>`
  margin-left: ${({ sub }) => sub ? `${sub}px` : 0};
  &&& {
    input[type="checkbox"] {
      margin-left: 0 !important;
      margin-right: 10px;
    }
  }
`;

export const SubHeader = styled.h5`
  font-size: 16px;
  font-weight: 500!important;
  margin: 10px 0px;
`;
