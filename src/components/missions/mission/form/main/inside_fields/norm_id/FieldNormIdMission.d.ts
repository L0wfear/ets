import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type StateFieldNormIdMission = {
};

export type StatePropsFieldNormIdMission = {
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
};
export type DispatchPropsFieldNormIdMission = {
  actionLoadCleaningOneNorm: HandleThunkActionCreator<
    typeof someUniqActions.actionLoadCleaningOneNorm
  >;
};

export type OwnPropsFieldNormIdMission = {
  value: Mission['norm_ids'];
  datetime: Mission['date_start'];
  technical_operation_id: Mission['technical_operation_id'];
  municipal_facility_id: Mission['municipal_facility_id'];
  route_type: Mission['route_type'];
  type_ids: Mission['car_type_ids'];

  disabled: boolean;
  onChange: (obj: { [key in keyof Mission]?: Mission[key] }) => void;

  IS_TEMPLATE: boolean;
  MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

export type PropsFieldNormIdMission = StatePropsFieldNormIdMission &
  DispatchPropsFieldNormIdMission &
  OwnPropsFieldNormIdMission;
