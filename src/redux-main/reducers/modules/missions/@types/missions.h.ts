import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

export type IStateMissions = {
  missionTemplateList: MissionTemplate[];
  carForMissionTemplateList: Car[];
  carForMissionTemplateIndex: Record<Car['asuods_id'], Car>;
  dutyMissionTemplateList: DutyMissionTemplate[];

  dutyMissionData: {
    dutyMissionList: DutyMission[],
    total_count: number;
  };
};
