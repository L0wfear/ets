import missionTemplateActions from 'redux-main/reducers/modules/missions/mission_template/actions';
import dutyMissionTemplateActions from 'redux-main/reducers/modules/missions/duty_mission_template/actions';

const missionActions = {
  ...missionTemplateActions,
  ...dutyMissionTemplateActions,
};

export default missionActions;
