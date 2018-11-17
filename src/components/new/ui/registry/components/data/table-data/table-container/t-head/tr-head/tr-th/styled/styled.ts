import styled from 'styled-components';

export const EtsTheadTh = styled.th<{ canClick: boolean, width: number }>`
  &.ets-th {
    vertical-align: middle;
    user-select: none;
    background-color: #eee;
    padding: 8px;
    border: 1px solid white;
    border-bottom: 2px solid #c1c1c1 !important;;

    cursor: ${({ canClick }) => canClick ? 'pointer' : 'default'};
    width: ${({ width }) => width ? `${width}px` : 'auto'};
    &:hover {
      opacity: ${({ canClick }) => canClick ? 0.7 : 1};
    }
  }
`;
