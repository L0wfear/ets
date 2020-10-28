import { getChildrenData } from 'utils/routes/getChildrenData';

import inspactionAutobaseList from 'components/new/pages/inspection/autobase/_config_data';
import inspactionPgmList from 'components/new/pages/inspection/pgm_base/_config_data';
import carsConditionList from 'components/new/pages/inspection/cars_condition/_config_data';

// если нужно посмотреть на форму отдельно
// import inspactionContainerList from 'components/new/pages/inspection/container/_config_data';

const children = {
  inspactionAutobaseList,
  inspactionPgmList,
  carsConditionList,
  // inspactionContainerList,
};

export const monitoringPermissions = {
  all_inspaction: 'monitoring.all_inspaction', // Мониторинговая деятельность – все проверки
};

export default {
  title: 'Мониторинговая деятельность',
  path: '/monitoring',
  children,
  ...getChildrenData(children),
};
