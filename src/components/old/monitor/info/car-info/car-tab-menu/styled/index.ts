import styled from 'styled-components';

export const CarInfoButtonsRow = styled.div`
  display: flex;

  >button {
    flex: 1 1 auto;
  }
`;

export const ButtonsRowMargin = styled.div`
  >button {
    margin: 5px;
  }
  >button:first-child {
    margin-left: 0px;
  }
`;
