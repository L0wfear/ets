import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

export const CommissionMembersDataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

export const RowAddCommissionMembersWrapper = styled(EtsBootstrap.Row)`
  ${ButtonStyled} {
    max-width: 300px;
  }
`;
