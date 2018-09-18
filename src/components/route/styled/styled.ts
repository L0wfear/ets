import styled from 'styled-components';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';

export const EtsPageWrapRoute = styled(EtsPageWrap)`
  padding: 0px;
  height: 100%;
  flex-direction: row;
  &-menu {
    float:left;
    margin-top: 50px;
    .list-group-item {
      cursor: pointer;
    }
  }

  &-info {
    float:left;
    margin-left:30px;
    .route-name {
      font-size:20px;
      margin-bottom:20px;
    }
    .route-image {
      margin-top:20px;
    }
    .route-odhs-on-map {
      position: relative;
      height: 500px;
      width: 600px;
      margin-top: 20px;
      /*margin-left: 20px;*/
      border: 4px solid #ccc;
    }
    .route-odhs-list {
      position: absolute;;
      left:620px;
      width:380px;
      margin-top:-15px;
      ul {
        margin-left:-20px;
        li {
          display: block;
          max-width: 240px;
        }
        li:before{
          content: "";
          display: list-item;
          position: absolute;
        }
      }
    }
  }
  .list-group-item {

    display: block;
    max-width: 300px;
  }
  .route-name {
    //max-width: 600px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
