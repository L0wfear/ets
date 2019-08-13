import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type StateFieldCarMissionIdDutyMission = {
  MISSION_OPTIONS: DefaultSelectListMapper<any>[];
};

export type StatePropsFieldCarMissionIdDutyMission = {
  availableMissionsToBind: IStateMissions['dutyMissionData']['availableMissionsToBind'];
};
export type DispatchPropsFieldCarMissionIdDutyMission = {
  actionGetAndSetInStoreAvalilableMissionsToBind: HandleThunkActionCreator<typeof missionsActions.actionGetAndSetInStoreAvalilableMissionsToBind>
  actionSetDutyMissionPartialData: HandleThunkActionCreator<typeof missionsActions.actionSetDutyMissionPartialData>;
};

export type OwnPropsFieldCarMissionIdDutyMission = {
  value: DutyMission['car_mission_id'];
  name: DutyMission['car_mission_name'];
  error: string;
  isPermitted: boolean;
  disabled: boolean;

  technical_operation_id: DutyMission['technical_operation_id'];
  plan_date_start: DutyMission['plan_date_start'];
  plan_date_end: DutyMission['plan_date_start'];

  onChange: (obj: { [key in keyof DutyMission]?: DutyMission[key] }) => void;

  page: string;
  path: string;
};

export type PropsFieldCarMissionIdDutyMission = (
  StatePropsFieldCarMissionIdDutyMission
  & DispatchPropsFieldCarMissionIdDutyMission
  & OwnPropsFieldCarMissionIdDutyMission
);
