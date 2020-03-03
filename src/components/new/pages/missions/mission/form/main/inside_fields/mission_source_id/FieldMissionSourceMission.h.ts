import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';

export type StateFieldMissionSourceMission = {
  MISSION_SOURCE_OPTIONS: DefaultSelectListMapper<MissionSource>;
};

export type StatePropsFieldMissionSourceMission = {
  missionSource: IStateSomeUniq['missionSource'];
};
export type DispatchPropsFieldMissionSourceMission = {
};

export type OwnPropsFieldMissionSourceMission = {
  value: Mission['mission_source_id'];
  name: Mission['mission_source_name'];
  isPermitted: boolean;
  disabled: boolean;
  error: string;
  onChange: (obj: Pick<Mission, 'mission_source_id' | 'mission_source_name' | 'mission_source_text'> & Record<string, any>) => void;

  request_id?: Mission['request_id'];
  request_number?: Mission['request_number'];

  page: string;
  path: string;
};

export type PropsFieldMissionSourceMission = (
  StatePropsFieldMissionSourceMission
  & DispatchPropsFieldMissionSourceMission
  & OwnPropsFieldMissionSourceMission
);
