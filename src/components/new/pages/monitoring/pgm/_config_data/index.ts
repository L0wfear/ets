import permissions from 'components/new/pages/monitoring/pgm/_config_data/permissions';
import component from 'components/new/pages/monitoring/pgm/_config_data/components';

export default {
  path: '/monitoring/autobase',
  routePath: '/monitoring/pgm/:id?/:type?', // <<< Возможно, стоит поменять!!!
  title: 'Мониторинг состояния баз хранения ПГМ',
  entyity: 'monitoring.pgm',
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};
