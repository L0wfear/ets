import permissions from 'components/directories/repair/state_program/config-data/permissions';
import component from 'components/directories/repair/state_program/config-data/components';

export default {
  path: '/state-programy',
  title: 'Справочник государственных программ ремонта',
  entyity: 'repair_state_program',
  noDotList: false,
  component,
  permissions,
};
