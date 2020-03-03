import styled from 'styled-components';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';
import { TitleContainer } from 'components/new/ui/registry/components/data/header/title/styled/styled';

export const BoxContainerRegistry = styled(BoxContainer)`
  padding: 20px 10px;
  ${TitleContainer} {
    font-weight: 600;
  }
`;
