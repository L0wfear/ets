import permissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import component from 'components/new/pages/inspection/pgm_base/_config_data/components';

export default {
  path: '/monitoring/pgm_base',
  routePath: '/monitoring/pgm_base/:id?/:type?',
  title: 'Состояние баз хранения ПГМ',
  entyity: 'monitoring.pgm_base',
  noDotList: true,
  checkHidden: (isShow, props) => isShow && !props.isOkrug,
  component,
  permissions,
};
