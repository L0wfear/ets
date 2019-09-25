import styled from 'styled-components';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const CommissionMembersDataContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
`;

export const CommissionAgentsMembersItem = styled.div`
  display: flex;
  align-items: center;

  background-color: #ebf5ff;
  color: #007eff;
  border: solid 1px #b3d9ff;
  border-radius: 3px;
  margin-right: 3px;
  margin-bottom: 3px;
`;

export const CommissionAgentsMembersText = styled.div`
  font-size: 14px;
  padding: 0 10px;
`;

export const CommissionAgentsMembersRemoveButton = styled(EtsBootstrap.Button)`
  &&& {
    display: block;
    background-color: #ebf5ff;
    color: #007eff;
    border-right: solid 1px #b3d9ff;
    border-radius: 0px;
    font-size: 14px;
    min-height: 100%;
    height: 100%;
    padding: 3px 10px;
    &:hover {
      background: rgba(0, 113, 230, 0.08);
      color: #0071e6;
    }
  }
`;

export const RowAddCommissionMembersWrapper = styled.div`
  ${ButtonStyled} {
    max-width: 300px;
  }
`;

export const CommissionEmployeeWrapper = styled.div`
  .error {
    margin-top: 0px;
    margin-bottom: 10px;
  }
`;
