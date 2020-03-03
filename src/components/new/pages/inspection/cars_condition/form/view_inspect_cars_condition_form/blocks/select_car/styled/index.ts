import styled from 'styled-components';
import { ButtonShowTableFormStyled } from 'components/new/pages/inspection/cars_condition/components/button_inspect_cars_condition/ButtonShowTableForm';

export const ExtFieldContainer = styled.div`
  position: relative;
  z-index: 2;                                 /* из-за шапки таблицы */
`;

export const GreyTextContainer = styled.div`
  background: #eeeeee;
  padding: 10px 20px;
  border-radius: 3px;
  margin-bottom: 10px;
  p:last-child {
    margin-bottom: 0px;
  }
`;

export const CarConditionTitle = styled.h3`
  margin: 0px;
`;

export const SelectCarConditionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  ${ButtonShowTableFormStyled} {
    margin: 0px;
  }
`;
