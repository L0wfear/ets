import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

export type PropsRouteInfo = {
  noRouteName?: boolean;
  route: Route;
  mapKey: string;
  height?: string;
};

export type StateRouteInfo = {
};
