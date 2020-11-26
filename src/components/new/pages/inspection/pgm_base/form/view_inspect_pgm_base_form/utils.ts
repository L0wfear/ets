import { isObject, isNullOrUndefined } from 'util';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import { cloneDeep } from 'lodash';

export const defaultInspectPgmBase: InspectPgmBase = {
  agents_from_gbu: [],
  base_address: null,
  base_id: null,
  base_type: null,
  can_have_container: false,
  capacity_cnt: null,
  close_employee_assignment: null,
  close_employee_assignment_date_start: null,
  close_employee_fio: null,
  close_employee_id: null,
  close_employee_position: null,
  commission_members: [],
  company_id: null,
  company_name: null,
  company_short_name: null,
  created_at: null,
  data: {
    access_roads_in_poor_condition: false,
    containers_in_poor_condition: false,
    equipment_and_piping_in_poor_condition: false,
    hangar_is_not_sealed: false,
    insufficient_availability_of_wooden_pallets: false,
    lack_of_changing_rooms: false,
    lack_of_documents_etc: null,
    lack_of_documents_on_pgm: false,
    lack_of_height_restriction_sign: false,
    lack_of_information_stands: false,
    lack_of_lighting: false,
    lack_of_lighting_in_hangars: false,
    lack_of_loading_unloading_mechanisms: false,
    lack_of_personal_protection: false,
    lack_of_ramps_stairs: false,
    lack_of_records_in_training_logs: false,
    lack_of_rest_rooms: false,
    lack_of_schema_slinging: false,
    lack_of_shelter_for_solid_pgm: false,
    lack_of_shower: false,
    lack_of_technical_passport: false,
    lack_of_wooden_pallets: false,
    lack_traffic_scheme_at_entrance: false,
    pgm_in_hangars: null,
    pgm_on_open_area: null,
    type_coverage_in_hangar: [],
    type_of_base_coverage: [],
    comments: null,
  },
  date_start: null,
  date_end: null,
  has_pgm: null,
  has_pgm_text: null,
  head_balance_holder_base: {
    fio: null,
    tel: null,
  },
  head_operating_base: {
    fio: null,
    tel: null,
  },
  id: null,
  inspection_company_id: null,
  inspection_company_name: null,
  okrug_id: null,
  okrug_name: null,
  open_employee_fio: null,
  open_employee_id: null,
  pgm_volume_sum: null,
  resolve_to: null,
  status_text: 'Проводится',
  status: 'conducting',
  type: 'pgm_base',
  updated_at: null,
  volume_capacity_sum: null,
  was_resaved: false,
  files: [],
  action: 'save',
  dataForValidation: null,
};

export const getDefaultInspectPgmBaseElement = (element: Partial<InspectPgmBase>) => {
  const newElement = cloneDeep(defaultInspectPgmBase);

  if (isObject(element)) {
    Object.keys(defaultInspectPgmBase).forEach((key) => {
      newElement[key] = isNullOrUndefined(element[key]) || element[key] === ''
        ? defaultInspectPgmBase[key]
        : element[key];
    });
  }

  return newElement;
};
