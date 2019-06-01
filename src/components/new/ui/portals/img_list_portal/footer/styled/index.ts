import styled from 'styled-components';
import { BlockContainer } from '../../styled';
import { ButtonStyled } from 'components/new/ui/@bootstrap/00-button/EtsButton';

export const ImgListFooterContainer = styled(BlockContainer)`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  align-items: center;

  ${ButtonStyled} {
    width: 75px;
  }
`;
