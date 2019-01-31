import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';

export type StatePropsFieldRouteAndStructureDutyMissionTemplate = {
  municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList'];
};
export type DispatchPropsFieldRouteAndStructureDutyMissionTemplate = {
  routesLoadRouteById: HandleThunkActionCreator<typeof routesActions.routesLoadRouteById>;
  routesGetSetRoutes: HandleThunkActionCreator<typeof routesActions.routesGetSetRoutes>;
};
export type OwnPropsFieldRouteAndStructureDutyMissionTemplate = {
  error_route_id: string | null;
  error_structure_id: string | null;
  route_id: MissionTemplate['route_id'],
  municipal_facility_id: MissionTemplate['municipal_facility_id'],
  municipal_facility_name: MissionTemplate['municipal_facility_name'],
  technical_operation_id: MissionTemplate['technical_operation_id'],
  technical_operation_name: MissionTemplate['technical_operation_name'],

  structure_id: MissionTemplate['structure_id'],
  structure_name: MissionTemplate['structure_name'],

  handleChange: (obj: Partial<DutyMissionTemplate>) => void;

  page: string;
  path: string;
};

export type PropsFieldRouteAndStructureDutyMissionTemplate = (
  StatePropsFieldRouteAndStructureDutyMissionTemplate
  & DispatchPropsFieldRouteAndStructureDutyMissionTemplate
  & OwnPropsFieldRouteAndStructureDutyMissionTemplate
);

export type StateFieldRouteAndStructureDutyMissionTemplate = {
  showRouteForm: boolean;
  selectedRouteRaw: Partial<Route> | null;
  selectedRoute: Route | null;
  routesList: Route[];
};
