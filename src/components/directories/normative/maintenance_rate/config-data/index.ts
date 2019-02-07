import permissions from 'components/directories/normative/maintenance_rate/config-data/permissions';
import component from 'components/directories/normative/maintenance_rate/config-data/components';

export default {
  path: '/maintenance-rate',
  title: 'Нормы на содержание объектов',
  entyity: 'maintenance_rate',
  noDotList: false,
  component,
  permissions,
};
