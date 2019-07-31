import { getChildrenData } from 'utils/routes/getChildrenData';

import operational from 'components/old/reports/operational/config-data';
import regulated from 'components/old/reports/regulated/config-data';
import analytics from 'components/old/reports/analytics/config-data';

const children = {
  operational,
  regulated,
  analytics,
};

export default {
  title: 'Отчёты',
  children,
  ...getChildrenData(children),
};
