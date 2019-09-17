import permissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import component from 'components/new/pages/inspection/autobase/_config_data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const monitoring_autobase_page_config: ConfigPageData = {
  path: '/monitoring/autobase',
  routePath: '/monitoring/autobase/:id?/:type?',
  title: 'Обустройство автобаз',
  isNewRegistry: false,
  entyity: 'inspect.autobase',

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,
};

export default monitoring_autobase_page_config;
