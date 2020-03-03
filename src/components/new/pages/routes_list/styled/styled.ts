import styled, { css } from 'styled-components';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';
import { constantColor } from 'global-styled/global-constants';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const EtsPageWrapRoute = styled(EtsPageWrap)`
  padding: 0px;
  height: 100%;
  width: 100%;
  position: absolute;
`;

export const RouteListContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const RoutesTreeColWrap = styled(EtsBootstrap.Col)`
  background-color: #eee;
  height: 100%;
  &&& {
    padding: 0;
  }
`;

const cssActiveRoute = css`
  background-color: ${constantColor.colorGreen};
  color: #fff;
`;

export const LiRouteName = styled.li<{ active: boolean; }>`
  display: block;
  margin: 0 0 8px 0;
  padding: 5px 5px;
  font-size: 16px;
  color: ${constantColor.colorLink};
  cursor: pointer;

  &:hover {
    background-color: ${constantColor.colorGreen};
    color: #fff;
  }

  ${({ active }) => active ? cssActiveRoute : ''}
`;

export const RouteTreeContainer = styled.div`
  height: 100%;
  overflow: auto;
  padding: 0 15px;
`;

export const RouteTreeH4 = styled.h4`
  font-size: 20px;
  padding: 5px 15px 5px 15px;
`;

export const SidebarListContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;

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

export const RouteTreeMenuArrow = styled.span`
  font-size: 9px;
  position: relative;
  top: -1px;
`;

export const TreeDivChildren = styled.div`
  padding-left: 10px;
`;

export const RouteTreeMenu = styled.span`
  cursor: pointer;
`;
