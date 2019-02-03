import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import normative from 'components/directories/normative/config-data';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type StateFieldCarIdsMissionTemplate = {
};

export type StatePropsFieldCarIdsMissionTemplate = {
  municipalFacilityForMissionList: IStateSomeUniq['municipalFacilityForMissionList'];
  carForMissionTemplateList: IStateMissions['carForMissionTemplateList'];
  carForMissionTemplateIndex: IStateMissions['carForMissionTemplateIndex'];
};
export type DispatchPropsFieldCarIdsMissionTemplate = {
  actionGetAndSetInStoreCarForMission: HandleThunkActionCreator<typeof missionsActions.actionGetAndSetInStoreCarForMission>;
  actionResetCarsMissionTemplate: HandleThunkActionCreator<typeof missionsActions.actionResetCarsMissionTemplate>;
};

export type OwnPropsFieldCarIdsMissionTemplate = {
  value: MissionTemplate['car_ids'];
  error: string | void;
  disabled: boolean;
  isPermitted: boolean;
  onChange: (obj: { [key: string]: any }) => any;

  for_column: MissionTemplate['for_column'];
  car_gov_numbers: MissionTemplate['car_gov_numbers'];
  car_type_ids: MissionTemplate['car_type_ids'];
  car_type_names: MissionTemplate['car_type_names'];
  municipal_facility_id: MissionTemplate['municipal_facility_id'];
  structure_id: MissionTemplate['structure_id'];

  page: string;
  path: string;
};

export type PropsFieldCarIdsMissionTemplate = (
  StatePropsFieldCarIdsMissionTemplate
  & DispatchPropsFieldCarIdsMissionTemplate
  & OwnPropsFieldCarIdsMissionTemplate
);
