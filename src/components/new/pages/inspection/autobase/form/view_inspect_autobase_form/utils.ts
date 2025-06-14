import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';

export const defaultInspectAutobase: InspectAutobase = {
  base_address: null,
  base_id: null,
  close_employee_fio: null,
  close_employee_id: null,
  close_employee_assignment: null,
  close_employee_assignment_date_start: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  data: {
    is_coating_defects: false,
    is_under_construction: false,
    is_less_than_two_entrances: false,
    absence_of_a_shield_with_a_scheme_of_movement: false,
    is_road_signs: null,
    lack_of_fire_fighting_equipment: false,
    no_fencing: false,
    fencing_in_poor_condition: false,
    is_not_protected: false,
    protection_is_carried: null,
    lack_of_video_surveillance: false,
    is_hard_surface: [],
    surface_in_poor_condition: false,
    surface_area_of_destruction: null,
    presence_of_pits_potholes: false,
    lack_of_lighting: false,
    cnt_defective_light: null,
    lack_control_room: false,
    lack_repair_areas: false,
    cnt_repair_posts: null,
    repair_posts_in_poor_condition: null,
    lack_of_storage_facilities: false,
    lack_of_a_canopy_for_pgm: false,
    lack_of_washing: false,
    lack_of_recreation: false,
    lack_of_domestic: false,
    domestic_in_poor_condition: false,
    lack_of_water_supply: false,
    lack_of_sanitation: false,
    lack_of_toilets: false,
    lack_shower_cabins: false,
    comments: null,
    additional_fields: [],
  },
  date_start: null,
  delete_employee_fio: '',
  delete_employee_id: null,
  id: null,
  inspection_company_id: null,
  okrug_id: null,
  okrug_name: null,
  open_employee_fio: null,
  open_employee_id: null,
  status_text: null,
  agents_from_gbu: [],
  commission_members: [],
  resolve_to: null,
  close_employee_position: null,
  status: 'conducting',
  date_end: null,
  files: [],
  action: 'save',
  type: 'autobase',
  dataForValidation: null,
};

export const getDefaultInspectAutobaseElement = (element: Partial<InspectAutobase>) => {
  const newElement = cloneDeep(defaultInspectAutobase);

  if (isObject(element)) {
    Object.keys(defaultInspectAutobase).forEach((key) => {
      newElement[key] = isNullOrUndefined(element[key]) || element[key] === ''
        ? defaultInspectAutobase[key]
        : element[key];
    });
  }

  return newElement;
};
