import styled from 'styled-components';
import { TitleContainer } from '../../styled/styled';
import { SingleUiElementWrapperStyled } from 'components/@next/@ui/renderFields/styled';

export const ChangeIsCurrentStructureWrap = styled(TitleContainer)`
  font-size: 14px;
  margin: 0 -5px;
  display: flex;
  align-items: center;
  ${SingleUiElementWrapperStyled} {
    margin-bottom: 0px;
  }
`;
