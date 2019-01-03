import permissions from 'components/directories/data_for_calculation/maintenance_work/config-data/permissions';
import component from 'components/directories/data_for_calculation/maintenance_work/config-data/components';

export default {
  path: '/maintenance-work',
  title: 'Показатели регламентных работ',
  entyity: 'maintenance_work',
  noDotList: false,
  component,
  permissions,
};
