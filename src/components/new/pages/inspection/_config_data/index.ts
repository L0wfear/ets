import { getChildrenData } from 'utils/routes/getChildrenData';

import inspactionAutobaseList from 'components/new/pages/inspection/autobase/_config_data';
import inspactionPgmList from 'components/new/pages/inspection/pgm_base/_config_data';

const children = {
  inspactionAutobaseList,
  inspactionPgmList,
};

export default {
  title: 'Мониторинговая деятельность',
  path: '/monitoring',
  children,
  ...getChildrenData(children),
};
