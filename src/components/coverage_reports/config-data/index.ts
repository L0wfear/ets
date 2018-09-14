import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import odhCoverage from 'components/coverage_reports/odh_coverage/config-data';
import dtCoverage from 'components/coverage_reports/dt_coverage/config-data';

const children = {
  odhCoverage,
  dtCoverage,
};

export default {
  title: 'Оперативная обстановка',
  children,
  hiddenNav: true,
  permissions: getChildrenPermissions(children),
};
