import styled from 'styled-components';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';

export const BoxContainerRegistry = styled(BoxContainer)`
  padding: 0px;

  ${EtsTheadTh} {
    z-index: initial;
  }
`;
