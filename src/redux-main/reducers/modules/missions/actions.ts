import missionTemplateActions from 'redux-main/reducers/modules/missions/mission_template/actions';
import dutyMissionTemplateActions from 'redux-main/reducers/modules/missions/duty_mission_template/actions';
import dutyMissionActions from 'redux-main/reducers/modules/missions/duty_mission/actions';
import missionActions from 'redux-main/reducers/modules/missions/mission/actions';

const missionsActions = {
  ...missionTemplateActions,
  ...dutyMissionTemplateActions,
  ...dutyMissionActions,
  ...missionActions,
};

export default missionsActions;
