import { duty_mission_template_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/duty_mission_template/constant';

const buttonsTypes =  {
  export: 'export',
  filter: 'filter',
  create: 'create',
  read: 'read',
  remove: 'remove',
  createMissionByEdcReques: 'createMissionByEdcReques',
  createDutyMissionByEdcReques: 'createDutyMissionByEdcReques',

  ...duty_mission_template_types,
};

export default buttonsTypes;
