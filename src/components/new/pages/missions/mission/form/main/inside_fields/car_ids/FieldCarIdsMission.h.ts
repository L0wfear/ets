import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type StateFieldCarIdsMission = {
};

export type StatePropsFieldCarIdsMission = {
  carForMissionList: IStateMissions['missionData']['carsList'];
  carForMissionIndex: IStateMissions['missionData']['carsIndex'];
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
};
export type DispatchPropsFieldCarIdsMission = {
  actionGetAndSetInStoreCarForMission: HandleThunkActionCreator<typeof missionsActions.actionGetAndSetInStoreCarForMission>;
  actionResetCarsMission: HandleThunkActionCreator<typeof missionsActions.actionResetCarsMission>;
};

export type OwnPropsFieldCarIdsMission = {
  value: Mission['car_ids'];
  error: string;
  disabled: boolean;
  isPermitted: boolean;
  onChange: (obj: { [key: string]: any }) => any;

  for_column: Mission['for_column'];
  car_gov_numbers: Mission['car_gov_numbers'];
  car_model_names: Mission['car_model_names'];
  car_special_model_names: Mission['car_special_model_names'];
  car_type_ids: Mission['car_type_ids'];
  car_type_names: Mission['car_type_names'];
  municipal_facility_id: Mission['municipal_facility_id'];
  structure_id: Mission['structure_id'];

  IS_TEMPLATE?: boolean;
  MISSION_IS_ORDER_SOURCE?: boolean;

  loadByNormId?: boolean;
  norm_ids?: Mission['norm_ids'];

  page: string;
  path: string;
};

export type PropsFieldCarIdsMission = (
  StatePropsFieldCarIdsMission
  & DispatchPropsFieldCarIdsMission
  & OwnPropsFieldCarIdsMission
);
