import { getChildrenData } from 'utils/routes/getChildrenData';

import odhCoverage from 'components/old/coverage_reports/odh_coverage/config-data';
import dtCoverage from 'components/old/coverage_reports/dt_coverage/config-data';

const children = {
  odhCoverage,
  dtCoverage,
};

export default {
  title: 'Оперативная обстановка',
  children,
  hiddenNav: true,
  ...getChildrenData(children),
};
