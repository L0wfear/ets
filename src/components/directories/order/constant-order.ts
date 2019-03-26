import permissions_mission from 'components/missions/mission/config-data/permissions';
import permissions_mission_template from 'components/missions/mission_template/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';

export const TypeDownload = {
  old: '1',
  new: '2',
};
export const missionTemplateListPermission = {
  missionTemplate: [permissions_mission_template.create],
  dutyMissionTemplate: [dutyMissionTemplatePermissions.create],
  mission: [permissions_mission.create],
  dutyMission: [permissions_duty_mission.create],
};
