import permissions from 'components/directories/autobase/battery_manufacturer/config-data/permissions';
import component from 'components/directories/autobase/battery_manufacturer/config-data/components';

export default {
  path: '/battery-manufacturer',
  title: 'Производители аккумуляторов',
  entyity: 'autobase_battery_manufacturer',
  noDotList: false,
  component,
  permissions,
};
