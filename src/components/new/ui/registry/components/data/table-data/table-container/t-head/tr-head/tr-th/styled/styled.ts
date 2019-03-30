import styled from 'styled-components';

export const EtsTheadTh = styled.th<{ canClick?: boolean, width: number }>`
  &&& {
    vertical-align: middle;
    background-color: #eee;
    padding: 8px;
    border: 1px solid white;
    border-bottom: 2px solid #c1c1c1 !important;
    position: sticky;
    top: 0;

    cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
    width: ${({ width }) => width ? `${width}px` : 'auto'};
    &:hover {
      background-color: #f7f7f7;
    }
  }
`;
