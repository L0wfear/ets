import permissions from 'components/route/config-data/permissions';
import components from 'components/route/config-data/components';

export default {
  path: '/routes-list_old',
  title: 'Маршруты (DITETSSUP-1962)',
  entyity: 'route',
  noDotList: false,
  hiddenNav: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};
