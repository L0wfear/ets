import { getChildrenData } from 'utils/routes/getChildrenData';

import master from 'components/new/pages/doc_header/00-master/_config-data';
import dispatcher from 'components/new/pages/doc_header/01-dispatcher/_config-data';
import okrug from 'components/new/pages/doc_header/02-okrug/_config-data';
import common from 'components/new/pages/doc_header/03-common/_config-data';
import techMaintenance from 'components/new/pages/doc_header/04-tech-maintenance/_config-data';
import closeWaybill from 'components/new/pages/doc_header/05-close_waybill/_config-data';
import createMission from 'components/new/pages/doc_header/06-create_mission/_config-data';
import closeMission from 'components/new/pages/doc_header/07-close_mission/_config-data';
import issueAWaybill from 'components/new/pages/doc_header/08-issue_a_waybill/_config-data';
import createMissionByOrder from 'components/new/pages/doc_header/09-create_mission_by_order/_config-data';
import issueAWaybillWithoutMission from 'components/new/pages/doc_header/10-issue_a_waybill_without_mission/_config-data';

const children = {
  master,
  dispatcher,
  okrug,
  common,
  techMaintenance,
  closeWaybill,
  createMission,
  closeMission,
  issueAWaybill,
  createMissionByOrder,
  issueAWaybillWithoutMission,
};

export default {
  title: 'Руководства',
  children,
  ...getChildrenData(children),
};
