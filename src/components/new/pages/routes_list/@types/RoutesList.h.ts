import routesAction from 'redux-main/reducers/modules/routes/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { RouteComponentProps } from 'react-router-dom';

export type StatePropsRoutesList = {
  appConfig: InitialStateSession['appConfig'];
  structures: InitialStateSession['userData']['structures'];
};
export type DispatchPropsRoutesList = {
  actionLoadRoutes: HandleThunkActionCreator<
    typeof routesAction.actionLoadRoutes
  >;
  actionLoadRouteById: HandleThunkActionCreator<
    typeof routesAction.actionLoadRouteById
  >;
  actionRemoveRoute: HandleThunkActionCreator<
    typeof routesAction.actionRemoveRoute
  >;
};
export type OwnPropsRoutesList = RouteComponentProps<any>;
export type PropsRoutesList = StatePropsRoutesList &
  DispatchPropsRoutesList &
  OwnPropsRoutesList;
export type StateRoutesList = {
  selectedRoute: Route | null;
  selectedRoute_old: Route | null;
  showForm: boolean;
  filterValues: any;
  filterModalIsOpen: boolean;
  ROUTES: object;
  routesList: Array<Route>;
  showId: Set<any>;
  routesMapNameId: Map<any, any>;
};
