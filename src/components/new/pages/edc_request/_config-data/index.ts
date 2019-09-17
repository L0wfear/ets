import permissions from 'components/new/pages/edc_request/_config-data/permissions';
import component from 'components/new/pages/edc_request/_config-data/components';

import { config } from 'components/new/pages/edc_request/_config-data/registry-config';
import { getConfig } from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';
import { ConfigPageData } from 'components/@next/@types/config_data';

const edc_request_page_config: ConfigPageData = {
  path: '/edc_request',
  routePath: `/edc_request/:${config.list.data.uniqKeyForParams}?/:type?/:${getConfig([], 0).list.data.uniqKeyForParams}?`,
  title: 'Заявки',
  isNewRegistry: false,
  entyity: 'edc_request',

  component,
  permissions,
};

export default edc_request_page_config;
