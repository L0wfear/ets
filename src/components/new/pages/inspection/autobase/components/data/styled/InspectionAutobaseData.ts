import styled from 'styled-components';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';

export const BoxBorder = styled.div`
  border: 1px solid black;
  border-radius: 3px;
`;

export const BoxContainer = styled.div`
  border: 1px solid black;
  border-radius: 3px;
  padding: 0px 15px;
  margin: 4px -1px;
`;

export const BoxContainerRegistry = styled(BoxContainer)`
  padding: 0px;

  ${EtsTheadTh} {
    z-index: initial;
  }
`;
