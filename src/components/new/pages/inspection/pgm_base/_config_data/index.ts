import permissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import component from 'components/new/pages/inspection/pgm_base/_config_data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const monitoring_pgm_base_page_config: ConfigPageData = {
  path: '/monitoring/pgm_base',
  routePath: '/monitoring/pgm_base/:id?/:type?',
  title: 'Состояние баз хранения ПГМ',
  entyity: 'inspect.pgm_base',
  isNewRegistry: false,

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,
};

export default monitoring_pgm_base_page_config;
