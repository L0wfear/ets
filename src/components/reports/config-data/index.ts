import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import operational from 'components/reports/operational/config-data';
import regulated from 'components/reports/regulated/config-data';
import analytics from 'components/reports/analytics/config-data';

const children = {
  operational,
  regulated,
  analytics,
};

export default {
  title: 'Отчёты',
  children,
  permissions: getChildrenPermissions(children),
};
