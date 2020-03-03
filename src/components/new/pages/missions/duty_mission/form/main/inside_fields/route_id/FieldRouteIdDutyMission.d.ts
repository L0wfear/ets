import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { HandleThunkActionCreator } from 'react-redux';
import routesActions from 'redux-main/reducers/modules/routes/actions';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/index';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export type StatePropsFieldRouteIdDutyMission = {
  routesList: IStateRoutes['routesList'];
  municipalFacilityForDutyMissionList: IStateSomeUniq['municipalFacilityForDutyMissionList'];
  dependeceTechnicalOperation: IStateMissions['dutyMissionData']['dependeceTechnicalOperation'];
  edcRequest: IStateMissions['dutyMissionData']['edcRequest'];
};
export type DispatchPropsFieldRouteIdDutyMission = {
  actionLoadRouteById: HandleThunkActionCreator<
    typeof routesActions.actionLoadRouteById
  >;
  actionLoadAndSetInStoreRoutes: HandleThunkActionCreator<
    typeof routesActions.actionLoadAndSetInStoreRoutes
  >;
  actionResetSetRoutes: HandleThunkActionCreator<
    typeof routesActions.actionResetSetRoutes
  >;
};
export type OwnPropsFieldRouteIdDutyMission = {
  error: string | null;
  value: DutyMission['route_id'];
  name: DutyMission['route_name'];
  municipal_facility_id: DutyMission['municipal_facility_id'];
  municipal_facility_name: DutyMission['municipal_facility_name'];
  technical_operation_id: DutyMission['technical_operation_id'];
  technical_operation_name: DutyMission['technical_operation_name'];
  consumable_materials?: DutyMission['consumable_materials'];
  request_id?: DutyMission['request_id'];
  fromMission: boolean;
  fromMissionTemplate: boolean;
  DUTY_MISSION_IS_ORDER_SOURCE: boolean;

  isPermitted: boolean;
  disabled: boolean;

  structure_id: DutyMission['structure_id'];
  structure_name: DutyMission['structure_name'];

  onChange: (obj: Partial<DutyMission>) => void;
  page: string;
  path: string;

  formDataKey?: FormKeys;
};

export type PropsFieldRouteIdDutyMission = (
  StatePropsFieldRouteIdDutyMission
  & DispatchPropsFieldRouteIdDutyMission
  & OwnPropsFieldRouteIdDutyMission
);

export type StateFieldRouteIdDutyMission = {
  showRouteForm: boolean;
  selectedRouteRaw: Partial<Route> | null;
  selectedRoute: Route | null;
  ROUTE_OPTIONS: DefaultSelectListMapper<Route>;
};
