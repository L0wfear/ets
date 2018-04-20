import routerAndPermission from 'constants/routerAndPermission';

export const TypeDownload = {
  old: '1',
  new: '2',
};
export const missionTemplateListPermission = {
  missionTemplate: [routerAndPermission.missions.children['mission-templates-journal'].permissions.create],
  dutyMissionTemplate: [routerAndPermission.missions.children['duty-mission-templates-journal'].permissions.create],
  mission: [routerAndPermission.missions.children['mission-journal'].permissions.create],
  dutyMission: [routerAndPermission.missions.children['duty-missions-journal'].permissions.create],
};
