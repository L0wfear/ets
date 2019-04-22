import { getChildrenData } from 'utils/routes/getChildrenData';

import missionList from 'components/new/pages/missions/mission/_config-data';
import missionTemplateList from 'components/new/pages/missions/mission_template/_config-data';
import missionArchiveList from 'components/new/pages/missions/mission_archive/_config-data';
import dutyMissionList from 'components/new/pages/missions/duty_mission/_config-data';
import dutyMissionTemplateList from 'components/new/pages/missions/duty_mission_template/_config-data';
import dutyMissionArchiveList from 'components/new/pages/missions/duty_mission_archive/_config-data';

const children = {
  missionList,
  missionTemplateList,
  missionArchiveList,
  dutyMissionList,
  dutyMissionTemplateList,
  dutyMissionArchiveList,
};

export default {
  title: 'Задания',
  children,
  ...getChildrenData(children),
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
};
