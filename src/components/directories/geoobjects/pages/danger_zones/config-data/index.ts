import permissions from 'components/directories/geoobjects/pages/danger_zones/config-data/permissions';
import component from 'components/directories/geoobjects/pages/danger_zones/config-data/components';

export default {
  path: '/danger-zones',
  title: 'Справочник особо опасных мест',
  entyity: 'danger_zone',
  noDotList: false,
  component,
  permissions,
};
