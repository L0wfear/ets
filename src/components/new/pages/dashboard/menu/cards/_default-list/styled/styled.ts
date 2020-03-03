import styled from 'styled-components';

import {
  CollapseTitleContainer as CollapseTitleContainerOriginal,
  CollapseContainer as CollapseContainerOriginal,
} from 'components/old/ui/collapse/text/styled/styled';

export const CollapseContainer = styled(CollapseContainerOriginal)`
  /* border-bottom: 1px solid #d6d6d6; */
  padding: 15px 0;
`;

export const CollapseTitleContainer = styled(CollapseTitleContainerOriginal)`
  font-weight: 800;
`;
