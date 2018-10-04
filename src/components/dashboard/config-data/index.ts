import permissions from 'components/dashboard/config-data/permissions';
import components from 'components/dashboard/config-data/components';

export default {
  path: '/dashboard-old',
  title: 'Рабочий стол',
  entyity: 'dashboard',
  hiddenNav: true,
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};
