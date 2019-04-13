import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import component from 'components/new/pages/inspection/cars_condition/_config_data/components';

export default {
  path: '/monitoring/cars_condition',
  routePath: '/monitoring/cars_condition/:id?/:type?/:typeRightView?/:selectedCarsConditionsCar?',
  title: 'Мониторинг транспортных средств',
  entyity: 'inspect.cars_condition',
  isNewRegistry: true,
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};
