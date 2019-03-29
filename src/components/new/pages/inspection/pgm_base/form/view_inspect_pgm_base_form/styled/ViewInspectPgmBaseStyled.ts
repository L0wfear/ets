import styled from 'styled-components';

export const TitleForm = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
`;

export const CheckContainerTable = styled.div`
`;

export const CheckContainerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  border: solid 1px black;
  padding: 10px 15px;
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 10px;
  }
`;

export const CheckContainerTd = styled.div`
  max-width: 33%;
  width: 33%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonBlock = styled.div`
  button{
    margin-right: 5px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;
