import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type IStateMissions = {
  missionTemplateList: MissionTemplate[];
  carForMissionTemplateList: Car[];
  carForMissionTemplateIndex: {
    [asuods_id: string]: Car;
  };
  dutyMissionTemplateList: DutyMissionTemplate[];
};
