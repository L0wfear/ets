import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/index';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { IPropsHiddenMapForPrint } from './print/HiddenMapForPrint';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export type StatePropsFieldRouteIdMission = {
  routesList: IStateRoutes['routesList'];
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
  edcRequest: IStateMissions['missionData']['edcRequest'];
};
export type DispatchPropsFieldRouteIdMission = {
  actionLoadRouteById: HandleThunkActionCreator<typeof routesActions.actionLoadRouteById>;
  actionLoadAndSetInStoreRoutes: HandleThunkActionCreator<typeof routesActions.actionLoadAndSetInStoreRoutes>;
  actionResetSetRoutes: HandleThunkActionCreator<typeof routesActions.actionResetSetRoutes>;
};
export type OwnPropsFieldRouteIdMission = {
  error: string | null;
  value: Mission['route_id'];
  name: Mission['route_name'];
  municipal_facility_id: Mission['municipal_facility_id'];
  municipal_facility_name: Mission['municipal_facility_name'];
  technical_operation_id: Mission['technical_operation_id'];
  technical_operation_name: Mission['technical_operation_name'];
  for_column: Mission['for_column'];
  request_id?: Mission['request_id'];

  MISSION_IS_ORDER_SOURCE: boolean;
  IS_TEMPLATE?: boolean;

  isPermitted: boolean;
  disabled: boolean;

  mission_id: Mission['id'];

  structure_id: Mission['structure_id'],
  structure_name: Mission['structure_name'],

  hiddenMapConfig: IPropsHiddenMapForPrint['hiddenMapConfig'];

  onChange: (obj: Partial<Mission | MissionTemplate | any>) => void;

  page: string;
  path: string;
};

export type PropsFieldRouteIdMission = (
  StatePropsFieldRouteIdMission
  & DispatchPropsFieldRouteIdMission
  & OwnPropsFieldRouteIdMission
);

export type StateFieldRouteIdMission = {
  showRouteForm: boolean;
  selectedRouteRaw: Partial<Route> | null;
  selectedRoute: Route | null;
  ROUTE_OPTIONS: DefaultSelectListMapper<Route>;
};
