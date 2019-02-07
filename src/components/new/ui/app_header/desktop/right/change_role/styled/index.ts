import styled from 'styled-components';
import { DefaultFirstLvlMenu } from 'components/new/ui/app_header/styled';

export const ChangeRoleContainer = styled(DefaultFirstLvlMenu)`
  text-decoration: none;
  flex-direction: column;
  color: white;
  width: 250px;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 12px;
  cursor: pointer;
  :hover {
    background-color: #4c4c4c;
  }
`;

export const CompanyOptionsNewContainer = styled.div`
  width: 100%;
`;
