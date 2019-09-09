import permissions from 'components/new/pages/inspection/container/_config_data/permissions';
import component from 'components/new/pages/inspection/container/_config_data/components';
import { ConfigPageData } from 'components/@next/@types/config_data';

const inspection_container_page_config: ConfigPageData = {
  path: '/inspection/container',
  routePath: '/inspection/container/',
  title: 'container',
  isNewRegistry: true,
  entyity: 'inspect.container',

  checkHidden: (isShow, userData) => isShow && !userData.isOkrug,
  component,
  permissions,
};

export default inspection_container_page_config;
