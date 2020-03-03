import permissions from 'components/new/pages/dashboard/config-data/permissions';
import component from 'components/new/pages/dashboard/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const dashboard_page_config: ConfigPageData = {
  path: '/dashboard',
  title: 'Рабочий стол',
  entyity: 'dashboard',

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,
};

export default dashboard_page_config;
