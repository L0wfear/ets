import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import missionJournal from 'components/missions/mission/config-data';
import missionTemplateJournal from 'components/missions/mission_template/config-data';
import missionArchiveJournal from 'components/missions/mission-archive/config-data';
import dutyMissionJournal from 'components/missions/duty_mission/config-data';
import dutyMissionTemplateJournal from 'components/missions/duty_mission_template/config-data';
import dutyMissionArchiveJournal from 'components/missions/duty_mission-archive/config-data';

const children = {
  missionJournal,
  missionTemplateJournal,
  missionArchiveJournal,
  dutyMissionJournal,
  dutyMissionTemplateJournal,
  dutyMissionArchiveJournal,
};

export default {
  title: 'Задания',
  children,
  permissions: getChildrenPermissions(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
};
