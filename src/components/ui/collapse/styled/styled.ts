import styled from 'styled-components';

export const timeTransition = 300;

export const EtsCollapse = styled<{ maxHeight?: number, overFlow: string }, 'div'>('div')`
  overflow: ${({ overFlow }) => overFlow};
  will-change: max-height;
  transition: max-height ${timeTransition}ms;
  max-height: ${({ maxHeight }) => maxHeight}px;
`;
