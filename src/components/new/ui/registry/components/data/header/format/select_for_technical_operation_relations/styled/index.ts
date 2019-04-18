import styled from 'styled-components';
import { EtsHeaderContainer } from '../../../styled/styled';
import { mobiSize } from 'global-styled/global-constants';

export const EtsHeaderContainerSelectForTechnicalOperationRelations = styled(EtsHeaderContainer)`
  display: flex;
  justify-content: space-between;
  align-items: self-end;
  padding: 10px 10px 0px 10px;
  flex-direction: column;
  align-items: initial;

  @media screen and (max-width: ${mobiSize}px) {
    align-items: initial;
  }
`;
