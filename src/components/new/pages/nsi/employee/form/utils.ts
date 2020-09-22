import { isObject, isArray, isNullOrUndefined } from 'util';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';

export type GetDefaultEmployeeElement = (batteryRegistry: Employee | null) => Employee;

export const defaultEmployee: Employee = {
  active: true,
  additional_companies: [],
  birthday: null,
  can_duty_mission: false,
  category_drivers_license: [],
  category_drivers_license_text: null,
  category_special_license: [],
  category_special_license_text: null,
  company_id: null,
  company_name: null,
  company_structure_id: null,
  company_structure_name: null,
  drivers_license: null,
  driver_license_country_id: null,
  drivers_license_date_end: null,
  driver_license_files: [],
  first_name: null,
  full_name: null,
  files: [],
  has_car: null,
  id: null,
  is_brigade: false,
  is_common: false,
  last_name: null,
  medical_certificate: null,
  medical_certificate_files: [],
  middle_name: null,
  okrug_name: null,
  personnel_number: null,
  phone: null,
  position_id: null,
  position_name: null,
  prefer_car: null,
  prefer_car_text: null,
  snils: null,
  secondary_car: [],
  secondary_car_text: null,
  special_license: null,
  special_license_country_id: null,
  special_license_date_end: null,
  special_marks: null,
  assignment: null,
  assignment_date_start: null,
  assignment_date_end: null,
  assignment_files: [],
};

export const getDefaultEmployeeElement: GetDefaultEmployeeElement = (element) => {
  const newElement = { ...defaultEmployee };
  if (isObject(element)) {
    Object.keys(defaultEmployee).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultEmployee[key];
    });
  }

  return newElement;
};

export function filterCars(car, formState, fieldType: 'prefer_car' | 'secondary_car') {
  let isValid = false;
  const secondary_car = get(formState, 'secondary_car', []);
  const prefer_car = get(formState, 'prefer_car', null);

  if (fieldType === 'prefer_car' && prefer_car && prefer_car === car.asuods_id || fieldType === 'secondary_car' && isArray(secondary_car) && secondary_car.includes(car.asuods_id)) {
    isValid = true;
  } else if (car.available_to_bind) {
    // @todo
    if (car.type_id === 15) { // car.type_id === 15 компрессор
      isValid = true;
    }
    if (
      formState
      && formState.drivers_license_date_end
      && diffDates(formState.drivers_license_date_end, new Date()) > 0
      && car.for_driver_license
    ) {
      isValid = true;
    }
    if (
      formState.special_license
      && formState.special_license_date_end
      && diffDates(formState.special_license_date_end, new Date()) > 0
      && car.for_special_license
    ) {
      isValid = true;
    }
  }

  if (
    fieldType === 'prefer_car' && isArray(secondary_car) && secondary_car.includes(car.asuods_id) 
    || fieldType === 'secondary_car' && prefer_car && prefer_car === car.asuods_id) {
    isValid = false;
  }

  return isValid;
}
