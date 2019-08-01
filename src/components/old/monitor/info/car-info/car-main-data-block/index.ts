import styled from 'styled-components';
import { CarInfoBlock } from 'components/old/monitor/styled';

export const CarInfoMainDataContainer = styled.div`
  ${CarInfoBlock} {
    padding: 10px;
  }

  .legend-color {
    display: flex;
    align-items: center;
    font-weight: 200;
    &>div {
      margin: 0px 2px;
    }
  }
  .car_info-legend-color {
    width: 10px;
    height: 10px;
    border-radius: 5px;

    &.red {
      background-color: rgb(255, 0, 51);;
    }
    &.green {
      background-color: rgb(102, 204, 0);;
    }
  }
`;
