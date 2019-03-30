import permissions from 'components/new/pages/edc_request/_config-data/permissions';
import component from 'components/new/pages/edc_request/_config-data/components';

import { config } from 'components/new/pages/edc_request/_config-data/registry-config';

export default {
  path: '/edc_request',
  routePath: `/edc_request/:${config.list.data.uniqKeyForParams}?/:type?`,
  title: 'Заявки',
  isNewRegistry: true,
  entyity: 'edc_request',
  noDotList: false,
  component,
  permissions,

  registryConfig: config,
};
