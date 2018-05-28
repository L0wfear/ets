import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import operational from 'components/reports/operational/config-data';

const children = {
  operational,
};

export default {
  title: 'Отчёты',
  children,
  permissions: getChildrenPermissions(children),
};
