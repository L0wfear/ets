import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';

export type StatePropsFieldRouteMissionTemplate = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldRouteMissionTemplate = {
  routesLoadRouteById: HandleThunkActionCreator<typeof routesActions.routesLoadRouteById>;
  routesGetSetRoutes: HandleThunkActionCreator<typeof routesActions.routesGetSetRoutes>;
};
export type OwnPropsFieldRouteMissionTemplate = {
  handleChange: any;

  page: string;
  path: string;
  error_route_id: string,
  route_id: MissionTemplate['route_id'],
  municipal_facility_id: MissionTemplate['municipal_facility_id'],
  municipal_facility_name: MissionTemplate['municipal_facility_name'],
  technical_operation_id: MissionTemplate['technical_operation_id'],
  technical_operation_name: MissionTemplate['technical_operation_name'],
  structure_id: MissionTemplate['structure_id'],
  structure_name: MissionTemplate['structure_name'],
  for_column: MissionTemplate['for_column'],
};

export type PropsFieldRouteMissionTemplate = (
  StatePropsFieldRouteMissionTemplate
  & DispatchPropsFieldRouteMissionTemplate
  & OwnPropsFieldRouteMissionTemplate
);

export type StateFieldRouteMissionTemplate = {
  printKey: {
    big: string,
    small: string,
    routeInfo: string,
  };
  showRouteForm: boolean;
  selectedRouteRaw: Partial<Route> | null;
  selectedRoute: Route | null;
  routesList: Route[];
};
