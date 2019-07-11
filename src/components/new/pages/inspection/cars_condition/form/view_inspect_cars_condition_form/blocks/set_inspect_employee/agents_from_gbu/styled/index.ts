import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

export const AgentsFromGbuDataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;
export const RowAddRowAddAgentFromGbuWrapper = styled.div`
  ${ButtonStyled} {
    max-width: 300px;
  }
`;

export const AgentsFromGbuDataContainerAddMember = styled(EtsBootstrap.Col)`
  background-color: rgba(0, 0, 0, 0.1);
  padding-top: 15px;
  padding-bottom: 15px;

  margin: 5px 0;
`;

export const AgentsFromGbuWrapper = styled.div`
  .error {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`;
