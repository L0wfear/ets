import styled from 'styled-components';

export const EtsPaginatorPages = styled.div`

`;

export const EtsPaginatorContainer = styled.div`
  padding: 0px 10px;
  margin: 0px 1.5px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;

  ${EtsPaginatorPages}> button {
    margin: 1px;
  }
`;
