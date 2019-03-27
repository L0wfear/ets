import { duty_mission_template_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/duty_mission_template/constant';
import { edc_form_permitted_type } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';

const buttonsTypes =  {
  export: 'export',
  filter: 'filter',
  create: 'create',
  read: 'read',
  remove: 'remove',
  ...edc_form_permitted_type,
  ...duty_mission_template_types,
};

export default buttonsTypes;
