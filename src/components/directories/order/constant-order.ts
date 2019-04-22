import permissions_mission from 'components/missions/mission/config-data/permissions';
import permissions_mission_template from 'components/new/pages/missions/mission_template/_config-data/permissions';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';

export const TypeDownload = {
  old: '1',
  new: '2',
};
export const missionTemplateListPermission = {
  missionTemplate: [permissions_mission_template.create],
  dutyMissionTemplate: [dutyMissionTemplatePermissions.create],
  mission: [permissions_mission.create],
  dutyMission: [dutyMissionPermissions.create],
};
