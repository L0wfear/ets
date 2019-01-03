import permissions from 'components/new/pages/routes_list/config-data/permissions';
import component from 'components/new/pages/routes_list/config-data/components';

export default {
  path: '/routes-list',
  title: 'Маршруты',
  entyity: 'route',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};
