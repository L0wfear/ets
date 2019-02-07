import styled from 'styled-components';

export const MonitorPageContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;

  .layer-container {
    height: 100%;
    width: 100%;
    pointer-events: none;
    position: relative;
    &.measure {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }
  }

  .map_info-container {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: flex;
    flex-direction: row-reverse;
    >.icon-map-help {
      flex: 1 1;
      margin: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      >div {
        position: relative;
        margin: 10px;
      }
    }

    >.data_container-wrap {
      height: 100%;
      display: flex;
      flex-direction: row-reverse;
      overflow: hidden;

      .data_container-make-small {
        width: 50px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: hsla(0,0%,95%,.8);
        overflow-y: scroll;
        border: 1px solid rgba(0,0,0,.3);
        position: relative;
        transform: translate(1px, -1px);
        pointer-events: all;
        cursor: pointer;
        font-weight: bold;
        overflow: hidden;
      }
    }
    >.data_container, >.data_container-wrap>.data_container {
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
    }
  }
`;
