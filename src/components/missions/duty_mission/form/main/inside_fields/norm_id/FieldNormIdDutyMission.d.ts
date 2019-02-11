import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import routesActions from 'redux-main/reducers/modules/routes/actions';

export type StateFieldNormIdDutyMission = {};

export type StatePropsFieldNormIdDutyMission = {};
export type DispatchPropsFieldNormIdDutyMission = {
  actionLoadRouteById: HandleThunkActionCreator<
    typeof routesActions.actionLoadRouteById
  >;
  actionLoadCleaningOneNorm: HandleThunkActionCreator<
    typeof someUniqActions.actionLoadCleaningOneNorm
  >;
};

export type OwnPropsFieldNormIdDutyMission = {
  value: DutyMission['norm_id'];
  datetime: DutyMission['plan_date_start'];
  technical_operation_id: DutyMission['technical_operation_id'];
  municipal_facility_id: DutyMission['municipal_facility_id'];
  route_id: DutyMission['route_id'];

  disabled: boolean;
  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  IS_TEMPLATE: boolean;
  DUTY_MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type PropsFieldNormIdDutyMission = StatePropsFieldNormIdDutyMission &
  DispatchPropsFieldNormIdDutyMission &
  OwnPropsFieldNormIdDutyMission;
