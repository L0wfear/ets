import permissions from 'components/new/pages/edc_request/_config-data/permissions';
import component from 'components/new/pages/edc_request/_config-data/components';

export default {
  path: '/edc_request',
  routePath: '/edc_request/:id?/:type?',
  title: 'Заявки',
  isNewRegistry: true,
  entyity: 'edc_request',
  noDotList: false,
  component,
  permissions,
};
