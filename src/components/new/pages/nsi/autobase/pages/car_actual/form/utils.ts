import { isObject, isNullOrUndefined } from 'util';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';

export const defaultCar: Car = {
  asuods_id: null,
  available: null,
  available_to_bind: null,
  body_capacity: null,
  car_group_id: null,
  car_group_name: '',
  company_id: null,
  company_name: '',
  company_name_contractor: '',
  company_name_customer: '',
  company_structure_id: null,
  company_structure_name: '',
  condition: null,
  condition_bool: null,
  condition_text: '',
  equipment_sensors_str: '',
  equipment_sensors_types_ids: [],
  exploitation_date_start: '',
  for_driver_license: null,
  for_special_license: null,
  fuel_correction_rate: null,
  full_model_name: '',
  garage_number: '',
  gov_number: '',
  gps_code: '',
  is_common: null,
  is_trailer: null,
  level_sensors_num: null,
  load_capacity: null,
  max_speed: null,
  model_id: null,
  model_name: '',
  note: '',
  okrug_id: null,
  okrug_name: '',
  owner_id: null,
  owner_name: '',
  parking_address: '',
  season: null,
  season_label: null,
  season_name: '',
  special_model_id: null,
  special_model_name: '',
  type_id: null,
  type_image_name: '',
  type_name: '',
};

export const getDefaultCarElement = (element: Partial<Car>): Car => {
  const newElement = { ...defaultCar };
  if (isObject(element)) {
    Object.keys(defaultCar).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCar[key];
    });
  }

  return newElement;
};

export const memoizeMergeElement = memoizeOne(
  (element: any, selectedCarData: Car) => {
    if (!element.car_id && selectedCarData) {
      return {
        ...element,
        car_id: selectedCarData.asuods_id,
      };
    }

    return element;
  },
);
