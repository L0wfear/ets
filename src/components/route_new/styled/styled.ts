import styled from 'styled-components';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';

export const EtsPageWrapRoute = styled(EtsPageWrap)`
  padding: 0px;
  height: 100%;
  width: 100%;
  position: absolute;

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
`;

export const SidebarListContainer = styled.div`
  margin: auto;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  right: 0;
  padding-right: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-left: 20px;
  h5 {
    font-weight: normal;
  }
  >div:nth-of-type(n + 2) {
    margin-top: 5px;
  }
`;

export const RouteHeaderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const SeasonsFilterContainer = styled.div`
  width: 300px;
  font-size: 14px;
  line-height: normal;
`;

export const SpanTitleRouteGroup = styled.div`
  font-weight: 800;
  text-decoration: underline;
`;
