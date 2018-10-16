import styled from 'styled-components';

interface PropsCollapseTitleContainer {
  noClickOnTitle?: boolean;
}

export const CollapseContainer = styled<{ isOpen: boolean;}, 'div'>('div')`
`;

export const CollapseTitleContainer = styled<PropsCollapseTitleContainer, 'div'>('div')`
  cursor: ${({ noClickOnTitle }) => noClickOnTitle ? 'default' : 'pointer'}
  pointer-events: ${({ noClickOnTitle }) => noClickOnTitle ? 'none' : 'all'};
`;
