import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';

export type StatePropsFieldRouteMissionTemplate = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
};
export type DispatchPropsFieldRouteMissionTemplate = {
  actionLoadRouteById: HandleThunkActionCreator<
    typeof routesActions.actionLoadRouteById
  >;
  actionLoadRoutes: HandleThunkActionCreator<
    typeof routesActions.actionLoadRoutes
  >;
};
export type OwnPropsFieldRouteMissionTemplate = {
  handleChange: any;

  error_route_id: string;
  route_id: MissionTemplate['route_id'];
  municipal_facility_id: MissionTemplate['municipal_facility_id'];
  municipal_facility_name: MissionTemplate['municipal_facility_name'];
  technical_operation_id: MissionTemplate['technical_operation_id'];
  technical_operation_name: MissionTemplate['technical_operation_name'];
  structure_id: MissionTemplate['structure_id'];
  structure_name: MissionTemplate['structure_name'];
  for_column: MissionTemplate['for_column'];

  disabled: boolean;
  isPermitted: boolean;

  printMapKeyBig: string;
  printMapKeySmall: string;

  page: string;
  path: string;
};

export type PropsFieldRouteMissionTemplate = StatePropsFieldRouteMissionTemplate &
  DispatchPropsFieldRouteMissionTemplate &
  OwnPropsFieldRouteMissionTemplate;

export type StateFieldRouteMissionTemplate = {
  printKey: {
    routeInfo: string;
  };
  showRouteForm: boolean;
  selectedRouteRaw: Partial<Route> | null;
  selectedRoute: Route | null;
  routesList: Route[];
};
