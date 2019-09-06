import styled from 'styled-components';

type PropsCardBodyContainer = {
  isLoading?: boolean;
};

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

export const LineData = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #d6d6d6;
`;

export const CardBodyContainer = styled.div<PropsCardBodyContainer>`
  padding: 20px;
  padding-top: 5px;
  display: flex;
  flex-direction: column;

  pointer-events: ${({ isLoading }) => isLoading ? 'none' : 'all'};
  opacity: ${({ isLoading }) => isLoading ? '0.5' : '1'};

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

export const RightButtonBlockContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  >button:nth-of-type(n + 1) {
    margin-left: 5px;
  }
  >button:first-child {
    margin-left: 0px;
  }

  margin-top: ${({ needMarginBottom }: RightButtonBlockContainerType) => needMarginBottom ? '25px' : '10px'};
`;
