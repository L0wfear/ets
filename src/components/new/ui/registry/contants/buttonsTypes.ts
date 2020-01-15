import { duty_mission_template_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/duty_mission_template/constant';
import { edc_form_permitted_type } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';
import { read_cars_contisions_car_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/cars_conditions_car/constant';
import { employee_on_car_types } from '../components/data/header/buttons/component-button/button-by-type/employee_on_car/constant';
import { technical_operation_relations_types } from '../components/data/header/buttons/component-button/button-by-type/technical_operation_relations/constant';
import { duty_mission_types } from '../components/data/header/buttons/component-button/button-by-type/duty_mission/constant';
import { mission_types } from '../components/data/header/buttons/component-button/button-by-type/mission/constant';
import { mission_template_types } from '../components/data/header/buttons/component-button/button-by-type/mission_template/constant';
import { company_structure_types } from '../components/data/header/buttons/component-button/button-by-type/company_structure/constant';
import { waybill_types } from '../components/data/header/buttons/component-button/button-by-type/waybill/constant';
import { inspect_types } from '../components/data/header/buttons/component-button/button-by-type/inspect/constant';
import { car_actual_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/constant';
import { fuel_cards_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/fuel_cards/constant';

const buttonsTypes =  {
  export: 'export',
  filter: 'filter',
  export_filtred_data: 'export_filtred_data',
  create: 'create',
  read: 'read',
  remove: 'remove',
  columns_control: 'columns_control',
  ...inspect_types,
  ...waybill_types,
  ...mission_template_types,
  ...duty_mission_types,
  ...technical_operation_relations_types,
  ...employee_on_car_types,
  ...edc_form_permitted_type,
  ...duty_mission_template_types,
  ...read_cars_contisions_car_types,
  ...mission_types,
  ...company_structure_types,
  ...car_actual_types,
  ...fuel_cards_types,
};

export default buttonsTypes;
