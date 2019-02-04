import routesAction from 'redux-main/reducers/modules/routes/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { Route } from 'redux-main/reducers/modules/routes/@types/index';
import { RouteComponentProps } from 'react-router';

export type StatePropsRoutesList = {
  appConfig: InitialStateSession['appConfig'];
  structures: InitialStateSession['userData']['structures'];
};
export type DispatchPropsRoutesList = {
  actionLoadRoutes: HandleThunkActionCreator<typeof routesAction.actionLoadRoutes>;
  actionLoadRouteById: HandleThunkActionCreator<typeof routesAction.actionLoadRouteById>;
  actionRemoveRoute: HandleThunkActionCreator<typeof routesAction.actionRemoveRoute>;
};
export type OwnPropsRoutesList = RouteComponentProps<any>;
export type PropsRoutesList = (
  StatePropsRoutesList
  & DispatchPropsRoutesList
  & OwnPropsRoutesList
);
export type StateRoutesList = {
  selectedRoute: Route | null;
  selectedRoute_old: Route | null;
  showForm: boolean;
  filterValues: object;
  filterModalIsOpen: boolean;
  ROUTES: object;
  routesList: Route[];
  showId: Set<any>;
  season_id: number[];
  routesMapNameId: Map<any, any>,
};
