import { getChildrenData } from 'utils/routes/getChildrenData';

import inspactionAutobaseList from 'components/new/pages/inspection/autobase/_config_data';
// если нужно посмотреть на форму отдельно
// import inspactionContainerList from 'components/new/pages/inspection/container/_config_data';

const children = {
  inspactionAutobaseList,
  // inspactionContainerList,
};

export default {
  title: 'Мониторинговая деятельность',
  path: '/inspection',
  children,
  ...getChildrenData(children),
};
