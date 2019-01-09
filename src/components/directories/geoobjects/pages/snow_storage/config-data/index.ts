import permissions from 'components/directories/geoobjects/pages/snow_storage/config-data/permissions';
import component from 'components/directories/geoobjects/pages/snow_storage/config-data/components';

export default {
  path: '/snow-storage',
  title: 'Справочник пунктов временного складирования снега',
  entyity: 'snow_storage',
  noDotList: false,
  component,
  permissions,
};
