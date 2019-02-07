import permissions from 'components/program_registry/config-data/permissions';
import component from 'components/program_registry/config-data/components';

export default {
  path: '/program-registry',
  title: 'Планирование ремонтных работ',
  entyity: 'repair_program',
  noDotList: false,
  component,
  permissions,
};
