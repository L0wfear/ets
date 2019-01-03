import permissions from 'components/directories/autobase/cars/config-data/permissions';
import component from 'components/directories/autobase/cars/config-data/components';

export default {
  path: '/cars',
  title: 'Реестр транспортных средств',
  entyity: 'car',
  noDotList: false,
  component,
  permissions,
};
