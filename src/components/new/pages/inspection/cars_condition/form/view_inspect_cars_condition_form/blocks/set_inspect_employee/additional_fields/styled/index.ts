import styled from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { AgentsFromGbuMemberDataContainer } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/agents_from_gbu/styled';

export const RowAddAdditionalFiledsWrapper = styled.div`
  ${ButtonStyled} {
    max-width: 500px;
  }
  ${AgentsFromGbuMemberDataContainer} {
    padding: 30px 15px;
  }
`;

export const AdditionalFiledsWrapper = styled.div`
  .error {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`;

export const AdditionalFiledsAddBtn = styled(EtsBootstrap.Button)``;
