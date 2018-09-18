import styled from 'styled-components';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';

import {
  constant,
} from 'global-styled/global-constants';

export const EtsPageWrapDashboard = styled(EtsPageWrap)`
  .panel-footer {
    text-align: center;
  }
  .panel-heading {
    text-align: center;
  }
  .panel-body {
    position: relative;
  }
  .dashboard-card-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 990;
    background: rgba(236, 240, 241,0.8);
  }
  .dashboard-card-info {
    position: absolute;
    top: 0;

    ul {
      padding-left: 10px;
    }

    .well {

      border: 1px solid #292929;
      border-radius: 4px;
      padding: 0 20px 5px 20px;
      /*border: none;*/
      background-color: #eee;
      box-shadow: none;

      h5 {
        position: relative;
        overflow: hidden;
        padding: 15px 40px 15px 20px;
        margin: 0 -20px;
        font-weight: bold;

        &:after {
          display: block;
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: 1px;
          left: 20px;
          background-color: #d6d6d6;
        }
      }
    }
  }
  .dashboard-card-info.active {
    z-index: 990;
  }
  .dashboard-card-info:not(.active) {
    max-height: 1px;
  }
  .dashboard-card {
    z-index: 1000;
    &.no-margin-bottom {
      margin-bottom: 0;
    }
  }
  .card-chevron-right {
    position: absolute;
    right: 0;
    top: 100px;

    font-size: 18px;
    margin-right: -8px;
  }
  .card-chevron-left {
    position: absolute;
    left: 0;
    top: 100px;
    font-size: 18px;
    margin-left: -8px;
  }
  .dashboard-time {
    text-align: center;
    font-size: 35px;
    font-weight: bold;
  }
  .dashboard-date {
    text-align: center;
    font-size: 22px;
    margin-bottom: 10px;
  }
  .dashboard-title {
    text-align: center;
    font-size: 26px;
    line-height: 2.2;
  }
  .dashboard-card-sm {
    text-align: center;

    > .panel > .panel-body {
      padding: 15px 20px;
    }

    &.dashboard-management-card {
      .btn {
        min-width: 200px;
        /*+ .btn {
          margin-top: 20px;
        }*/
      }

      .dashboard-btn-wrapper + .dashboard-btn-wrapper {
        margin-top: 10px;
      }
    }
  }
  .dashboard-card.panel {
    > .panel-body {
      padding: 0;
      min-height: 20px;
    }
  }

    .dashboard-card-sm > .panel,
  .dashboard-card.panel {
    background-color: #eee;
    border: none;
    box-shadow: none;

    > .panel-heading {
      padding: 15px 52px 15px 20px;
      position: relative;
      overflow: hidden;
      text-align: left;
      font-weight: bold;
      color: inherit;
      background: none;
      border: none;

      &:after {
        display: block;
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 1px;
        left: 20px;
        background-color: #d6d6d6;
      }
    }

    &.panel-danger {
      background-color: #ffd7d7;

      > .panel-heading:after {
        background-color: #fff;
      }
    }
  }

    .card-glyph-remove {
    position: absolute;
    z-index: 20;
    right: 15px;
    top: 10px;
    cursor: pointer;
  }

  .menu-down-block {
    height: 50px;
    position: relative;
    overflow: hidden;
    padding-top: 16px;
    /*hr {
      margin-bottom: 5px !important;
    }*/
    &:after {
      display: block;
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 1px;
      left: 20px;
      background-color: #d6d6d6;
    }
  }

    .dashboard-card-items {
    .dashboard-card-item{
      position: relative;
      overflow: hidden;
      padding: 15px 0;

      >div>dl {
        margin: 0 20px;
        dt {
          font-weight: inherit;
        }
      }

      .dashboard-card-item-inner-singlevalue {
        width: 90%;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        font-weight: bold;
        font-size: 22px;
      }

      .dashboard-card-item-inner {
        width: 90%;
        text-align: left;
        margin-left: auto;
        margin-right: auto;
      }

      & + .dashboard-card-item {
        &:after {
          display: block;
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          top: 1px;
          left: 20px;
          background-color: #d6d6d6;
        }
      }
    }
  }

    .dashboard-card-title {
    max-width: 90%;
    display: inline-block;
  }

  .dashboard-card-refresh {
    position: absolute;
    right: 10px;
    top: 10px;
    display: block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    background-color: ${constant.colorButton};
    cursor: pointer;
  }
`;
