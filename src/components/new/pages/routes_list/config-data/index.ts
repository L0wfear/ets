import permissions from 'components/new/pages/routes_list/config-data/permissions';
import component from 'components/new/pages/routes_list/config-data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const route_list_page_data: ConfigPageData = {
  path: '/routes-list',
  title: 'Маршруты',
  entyity: 'route',

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,

  isNewRegistry: false,
};

export default route_list_page_data;
