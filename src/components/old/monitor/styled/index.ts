import styled, { css } from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const MonitorPageContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const DataContainer = styled.div`
  overflow-y: auto;
  pointer-events: all;
  flex: 1 1 auto;
  max-width: 500px;
  background-color: hsla(0,0%,95%,.8);
  border-left: 1px solid rgba(0,0,0,.3);
  height: 100%;

  &:last-child {
    box-shadow: -1px 0 30px rgba(0,0,0,.3);
    border-left: none;
  }

  &.geoobjects_info {
    max-width: 350px;
  }

  >div {
    margin: 10px;
  }
  .center-preloader {
    width: 100%;
    text-align: center;
    padding: 20px;
  }
`;

export const CarInfoBlock = styled.div`
  border: medium none;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
  background: #ffffff;
  padding: 0px 5px;
  border-radius: 3px;
  display: flex;

  >div {
    flex: 1 1 auto;
  }
  >div.car_info-img {
    flex: 3 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const tabDataCss = css`
  margin-top: 10px;
`;

export const CarInfoBlockTabData = styled(CarInfoBlock)`
  ${tabDataCss};
`;

export const CarInfoBlockColumn = styled(CarInfoBlock)`
  flex-direction: column;
`;

export const CarInfoBlockTabDataColumn = styled(CarInfoBlockColumn)`
  ${tabDataCss};
`;

export const CarInfoTitleSpanContainer = styled.div`
  display: flex;
  justify-content: center;
  white-space: pre-wrap;
`;

export const CarInfoClose = styled.span`
  display: flex;
  justify-content: flex-end;
  >div {
    cursor: pointer;
    transition: transform 0.5s, background-color 0.5s;
    will-change: transform, background-color;
    >span {
      position: relative;
      transform: translateY(-6%);
    }
    &:hover {
      transform: scale3d(1.1, 1.1, 1);
      background-color: ${UiConstants.colorError};
      color: white;
    }
  }
`;
