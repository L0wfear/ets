import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';

export type StateFieldMissionSourceDutyMission = {
  MISSION_SOURCE_OPTIONS: DefaultSelectListMapper<MissionSource>;
};

export type StatePropsFieldMissionSourceDutyMission = {
  missionSource: IStateSomeUniq['missionSource'];
};
export type DispatchPropsFieldMissionSourceDutyMission = {
};

export type OwnPropsFieldMissionSourceDutyMission = {
  value: DutyMission['mission_source_id'];
  name: DutyMission['mission_source_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string | void;
  onChange: (obj: Partial<DutyMission>) => void;

  page: string;
  path: string;
};

export type PropsFieldMissionSourceDutyMission = (
  StatePropsFieldMissionSourceDutyMission
  & DispatchPropsFieldMissionSourceDutyMission
  & OwnPropsFieldMissionSourceDutyMission
);
