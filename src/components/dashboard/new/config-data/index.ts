import permissions from 'components/dashboard/new/config-data/permissions';
import components from 'components/dashboard/new/config-data/components';

export default {
  path: '/dashboard',
  title: 'Рабочий стол',
  entyity: 'dashboard',
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  components,
  permissions,
};
