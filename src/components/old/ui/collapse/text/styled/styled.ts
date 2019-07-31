import styled from 'styled-components';

interface PropsCollapseTitleContainer {
  noClickOnTitle?: boolean;
}

export const CollapseContainer = styled.div<{ isOpen: boolean }>`
`;

export const CollapseTitleContainer = styled.div<PropsCollapseTitleContainer>`
  cursor: ${({ noClickOnTitle }) => noClickOnTitle ? 'default' : 'pointer'};
  pointer-events: ${({ noClickOnTitle }) => noClickOnTitle ? 'none' : 'all'};
`;
