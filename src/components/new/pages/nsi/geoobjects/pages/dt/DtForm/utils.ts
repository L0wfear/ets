import { isObject, isNullOrUndefined } from 'util';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';

export const defaultDt: Dt = {
  ab_area: null,
  auto_area: null,
  biulding_area: null,
  bound_stone_len: null,
  bti_okrug_id: null,
  clean_area: null,
  company_name: '',
  company_structures: [],
  developer: '',
  district_id: null,
  dt_id: null,
  end_date: '',
  flat_building_area: null,
  footway_area: null,
  green_area: null,
  green_index: null,
  id: null,
  manual_area: null,
  mechanical_clean_area: null,
  move_snow_heap_area: null,
  name: '',
  object_address: '',
  passport_author: '',
  passport_num: '',
  passport_requester: '',
  planting_density: null,
  pond_area: null,
  rotor_area: null,
  shape: {},
  snow_area: null,
  start_date: null,
  summer_total_clean_area: null,
  title_area: null,
  total_area: null,
  total_area_calc: null,
  winter_total_clean_area: null,
  yard_id: null,
  yard_info: '',
  yard_owner_id: null,
  area_machine_sum: null,
  area_hand_improved_sum: null,
  improved_cover_flag: null,
};

export const getDefaultDtFormElement = (element: Partial<Dt>): Dt => {
  const newElement = { ...defaultDt };
  if (isObject(element)) {
    Object.keys(defaultDt).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultDt[key];
    });
  }

  return newElement;
};
