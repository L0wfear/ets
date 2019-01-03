import permissions from 'components/directories/order/config-data/permissions';
import component from 'components/directories/order/config-data/components';

export default {
  path: '/orders',
  title: 'Реестр централизованных заданий',
  entyity: 'faxogramm',
  noDotList: false,
  component,
  permissions,
};
