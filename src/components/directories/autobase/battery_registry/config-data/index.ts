import permissions from 'components/directories/autobase/battery_registry/config-data/permissions';
import component from 'components/directories/autobase/battery_registry/config-data/components';

export default {
  path: '/battery-registry',
  title: 'Реестр аккумуляторов',
  entyity: 'autobase_battery',
  noDotList: false,
  component,
  permissions,
};
