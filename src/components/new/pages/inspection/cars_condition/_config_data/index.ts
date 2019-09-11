import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import component from 'components/new/pages/inspection/cars_condition/_config_data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const monitoring_cars_condition_page_config: ConfigPageData = {
  path: '/monitoring/cars_condition',
  routePath: '/monitoring/cars_condition/:id?/:type?/:typeRightView?/:selectedCarsConditionsCar?',
  title: 'Мониторинг транспортных средств',
  entyity: 'inspect.cars_condition',
  isNewRegistry: true,

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,
};

export default monitoring_cars_condition_page_config;
