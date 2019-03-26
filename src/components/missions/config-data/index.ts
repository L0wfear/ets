import { getChildrenData } from 'utils/routes/getChildrenData';

import missionJournal from 'components/missions/mission/config-data';
import missionTemplateJournal from 'components/missions/mission_template/config-data';
import missionArchiveJournal from 'components/missions/mission-archive/config-data';
import dutyMissionJournal from 'components/missions/duty_mission/config-data';
import dutyMissionArchiveJournal from 'components/missions/duty_mission-archive/config-data';

// new
import dutyMissionTemplateList from 'components/new/pages/missions/duty_mission_template/_config-data';

const children = {
  missionJournal,
  missionTemplateJournal,
  missionArchiveJournal,
  dutyMissionJournal,

  dutyMissionTemplateList, // new

  dutyMissionArchiveJournal,
};

export default {
  title: 'Задания',
  children,
  ...getChildrenData(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
};
