import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import missionJournal from 'components/missions/mission/config-data';
import missionTemplateJournal from 'components/missions/mission_template/config-data';
import dutyMissionJournal from 'components/missions/duty_mission/config-data';
import dutyMissionTemplateJournal from 'components/missions/duty_mission_template/config-data';

const children = {
  missionJournal,
  missionTemplateJournal,
  dutyMissionJournal,
  dutyMissionTemplateJournal,
};

export default {
  title: 'Задания',
  children,
  permissions: getChildrenPermissions(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
}