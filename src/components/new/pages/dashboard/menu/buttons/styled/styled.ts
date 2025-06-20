import styled from 'styled-components';

export const DashboardMenuButtonsContainer = styled.div`
  flex: 3 3 0px;

  @media screen and (max-width: 990px) {
    min-width: 100%;
  }
`;

export const CardTitleContainer = styled.div`
  padding: 20px;
  padding-bottom: 5px;
  font-weight: bold;
  text-align: center;

  &:after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    bottom: 1px;
    left: 20px;
    /* background-color: #d6d6d6; */
  }
`;

export const CardBodyContainer = styled.div`
  padding: 20px;
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  >button {
    margin: 5px;
    width: 100%;
    white-space: normal;

    &:hover {
      word-break: break-word;
    }
  }
  >* {
    margin: 5px;
    width: 100%;
    &>button {
      width: 100%;
      white-space: normal;

      &:hover {
        word-break: break-word;
      }
    }
  }
`;
