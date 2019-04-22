import { duty_mission_template_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/duty_mission_template/constant';
import { edc_form_permitted_type } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';
import { read_cars_contisions_car_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/cars_conditions_car/constant';
import { employee_on_car_types } from '../components/data/header/buttons/component-button/button-by-type/employee_on_car/constant';
import { technical_operation_relations_types } from '../components/data/header/buttons/component-button/button-by-type/technical_operation_relations/constant';
import { duty_mission_types } from '../components/data/header/buttons/component-button/button-by-type/duty_mission/constant';
import { mission_template_types } from '../components/data/header/buttons/component-button/button-by-type/mission_template/constant';

const buttonsTypes =  {
  export: 'export',
  filter: 'filter',
  create: 'create',
  read: 'read',
  remove: 'remove',
  ...mission_template_types,
  ...duty_mission_types,
  ...technical_operation_relations_types,
  ...employee_on_car_types,
  ...edc_form_permitted_type,
  ...duty_mission_template_types,
  ...read_cars_contisions_car_types,
};

export default buttonsTypes;
