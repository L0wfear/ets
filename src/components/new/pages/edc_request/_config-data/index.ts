import permissions from 'components/new/pages/edc_request/_config-data/permissions';
import component from 'components/new/pages/edc_request/_config-data/components';

import { config } from 'components/new/pages/edc_request/_config-data/registry-config';
import { getConfig } from 'components/new/pages/edc_request/form/requestInfo/table/_config_data/registry-config';

export default {
  path: '/edc_request',
  routePath: `/edc_request/:${config.list.data.uniqKeyForParams}?/:type?/:${getConfig([]).list.data.uniqKeyForParams}?`,
  title: 'Заявки',
  isNewRegistry: true,
  entyity: 'edc_request',
  noDotList: false,
  component,
  permissions,

  registryConfig: config,
};
