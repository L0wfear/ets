import permissions from 'components/route_new/config-data/permissions';
import components from 'components/route_new/config-data/components';

export default {
  path: '/routes-list',
  title: 'Маршруты',
  entyity: 'route',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};
