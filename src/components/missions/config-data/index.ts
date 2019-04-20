import { getChildrenData } from 'utils/routes/getChildrenData';

import missionJournal from 'components/missions/mission/config-data';
import missionTemplateJournal from 'components/missions/mission_template/config-data';
import missionArchiveJournal from 'components/missions/mission-archive/config-data';

// new
import dutyMissionList from 'components/new/pages/missions/duty_mission/_config-data';
import dutyMissionTemplateList from 'components/new/pages/missions/duty_mission_template/_config-data';
import dutyMissionArchiveList from 'components/new/pages/missions/duty_mission_archive/_config-data';

const children = {
  missionJournal,
  missionTemplateJournal,
  missionArchiveJournal,

  dutyMissionList, // new
  dutyMissionTemplateList, // new
  dutyMissionArchiveList, // new
};

export default {
  title: 'Задания',
  children,
  ...getChildrenData(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
};
