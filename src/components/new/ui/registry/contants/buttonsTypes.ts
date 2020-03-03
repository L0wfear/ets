import { duty_mission_template_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/duty_mission_template/constant';
import { edc_form_permitted_type } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/constant';
import { technical_operation_relations_types } from '../components/data/header/buttons/component-button/button-by-type/technical_operation_relations/constant';
import { duty_mission_types } from '../components/data/header/buttons/component-button/button-by-type/duty_mission/constant';
import { mission_types } from '../components/data/header/buttons/component-button/button-by-type/mission/constant';
import { mission_template_types } from '../components/data/header/buttons/component-button/button-by-type/mission_template/constant';
import { waybill_types } from '../components/data/header/buttons/component-button/button-by-type/waybill/constant';
import { inspect_types } from '../components/data/header/buttons/component-button/button-by-type/inspect/constant';
import { order_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant';
import { fuel_cards_types } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/fuel_cards/constant';

const buttonsTypes =  {
  export: 'export',
  filter: 'filter',
  export_filtred_data: 'export_filtred_data',
  create: 'create',
  read: 'read',
  remove: 'remove',
  columns_control: 'columns_control',
  show_сars_condition_table_defects: 'show_сars_condition_table_defects',
  ButtonAddNewRowTable: 'button_add_new_row_table',
  ...inspect_types,
  ...waybill_types,
  ...mission_template_types,
  ...duty_mission_types,
  ...technical_operation_relations_types,
  ...edc_form_permitted_type,
  ...duty_mission_template_types,
  ...mission_types,
  ...order_types,
  ...fuel_cards_types,
} as const;

export default buttonsTypes;
