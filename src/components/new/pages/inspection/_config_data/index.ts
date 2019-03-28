import { getChildrenData } from 'utils/routes/getChildrenData';

import inspactionAutobaseList from 'components/new/pages/inspection/autobase/_config_data';

const children = {
  inspactionAutobaseList,
};

export default {
  title: 'Мониторинговая деятельность',
  path: '/inspection',
  children,
  ...getChildrenData(children),
};
