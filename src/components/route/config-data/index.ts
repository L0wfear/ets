import permissions from 'components/route/config-data/permissions';
import components from 'components/route/config-data/components';

export default {
  path: '/routes-list',
  title: 'Маршруты',
  entyity: 'route',
  noDotList: false,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
}