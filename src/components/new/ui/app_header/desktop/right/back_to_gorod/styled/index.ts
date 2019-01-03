import styled from 'styled-components';
import { DefaultFirstLvlMenu } from 'components/new/ui/app_header/styled';

export const BackToGorodContainer = styled(DefaultFirstLvlMenu)`
  text-decoration: none;
  color: white;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;

  :hover {
    background-color: #4c4c4c;
  }
`;
