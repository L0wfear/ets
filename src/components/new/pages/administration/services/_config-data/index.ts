import permissions from 'components/new/pages/administration/services/_config-data/permissions';
import component from 'components/new/pages/administration/services/_config-data/components';
import { config } from 'components/new/pages/administration/services/_config-data/registry-config';
import { ConfigPageData } from 'components/@next/@types/config_data';

const service_page_config: ConfigPageData = {
  path: '/administration/services',
  routePath: `/administration/services/:${config.list.data.uniqKeyForParams}?`,
  title: 'Управление сервисами',
  isNewRegistry: false,
  entyity: 'services',

  component,
  permissions,
};

export default service_page_config;
