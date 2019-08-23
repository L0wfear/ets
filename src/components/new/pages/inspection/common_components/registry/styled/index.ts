import styled from 'styled-components';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';
import { TitleContainer } from 'components/new/ui/registry/components/data/header/title/styled/styled';

export const BoxContainerRegistry = styled(BoxContainer)`
  padding: 30px 20px;
  ${TitleContainer} {
    font-weight: 600;
  }
`;
