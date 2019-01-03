import permissions from 'components/new/pages/routes_list/config-data/permissions';
import components from 'components/new/pages/routes_list/config-data/components';

export default {
  path: '/routes-list',
  title: 'Маршруты',
  entyity: 'route',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};
