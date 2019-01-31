import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';

export type IStateMissions = {
  missionTemplateList: MissionTemplate[];
  dutyMissionTemplateList: DutyMissionTemplate[];
};
