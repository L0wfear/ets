import permissions from 'components/route/config-data/permissions';
import component from 'components/route/config-data/components';

export default {
  path: '/routes-list_old',
  title: 'Маршруты (DITETSSUP-1962)',
  entyity: 'route',
  noDotList: false,
  hiddenNav: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};
