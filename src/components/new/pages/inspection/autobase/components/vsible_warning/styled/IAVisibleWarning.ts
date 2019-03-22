import styled from 'styled-components';

export const IAVisibleWarningInputContainer = styled.div<{ sub?: number }>`
  margin-left: ${({ sub }) => sub ? `${sub}px` : 0};
  &&& {
    input[type="checkbox"] {
      margin-left: 0 !important;
    }
  }
`;
