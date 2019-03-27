import { getChildrenData } from 'utils/routes/getChildrenData';

import pgmList from 'components/new/pages/monitoring/pgm/_config_data';

const children = {
  pgmList,
};

export default {
  title: 'Мониторинговая деятельность',
  path: '/monitoring',
  children,
  ...getChildrenData(children),
};
