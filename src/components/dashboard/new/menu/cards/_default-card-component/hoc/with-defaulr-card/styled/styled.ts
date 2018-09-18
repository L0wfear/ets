import styled from 'styled-components';

type PropsCardBodyContainer = {
  isLoading?: boolean;
};

export const CardContainer = styled.div`
  position: relative;
  background-color: #eee;
  border-radius: 4px;

  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.3);

  ul {
    padding-left: 20px;
  }
`;

export const CardMainContainer = styled(CardContainer)`
  min-width: 300px;
  flex: 1 1 350px;
  margin: 20px;

  @media screen and (max-width: 1164px) {
    max-width: 100%;
  }

  @media screen and (max-width: 793px) {
    max-width: 100%;
  }
`;

export const CardTitleContainer = styled.div`
  padding: 20px;
  padding-bottom: 5px;
  font-weight: bold;

  &:after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    bottom: 1px;
    left: 20px;
    background-color: #d6d6d6;
  }
`;

export const CardTitleContainerWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  &>*:nth-of-type(n + 2) {
    margin-left: 10px;
  }
`;

export const CardBodyContainer = styled.div`
  padding: 20px;
  padding-top: 5px;
  display: flex;
  flex-direction: column;

  pointer-events: ${({ isLoading }: PropsCardBodyContainer) => isLoading ? 'none': 'all'};
  opacity: ${({ isLoading }) => isLoading ? '0.5': '1'};

  .line_data {
    padding: 15px 0;
    border-bottom: 1px solid #d6d6d6;

    &.number {
      display: flex;
      justify-content: center;
      font-weight: bold;
      font-size: 22px;
    }

    &.bold {
      font-weight: 800;
      .initial_font_weight {
        font-weight: initial;
      }
    }
  }

  .right_button_block {
    display: flex;
    justify-content: flex-end;

    >button:nth-of-type(n + 1) {
      margin-left: 5px;
    }

    &.buttons_order_info {
      margin-top: 25px;
    }
  }
`;

type RightButtonBlockContainerType = {
  needMarginBottom?: boolean;
};


export const RightButton_BlockContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  >button:nth-of-type(n + 1) {
    margin-left: 5px;
  }

  margin-top: ${({ needMarginBottom }: RightButtonBlockContainerType) => needMarginBottom ? '25px' : 'initial'};
`;