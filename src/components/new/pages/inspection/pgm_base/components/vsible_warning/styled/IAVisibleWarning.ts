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

export const SubHeader = styled.div`
  font-size: 16px;
  margin: 10px 0px;
`;
