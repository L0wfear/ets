import { isObject } from 'util';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultRoadAccidentElement = (roadAccident: RoadAccident | null) => RoadAccident;

export const defaultRoadAccident: RoadAccident = {
  accident_date: null,
  accident_place: null,
  car_gov_number: null,
  car_id: null,
  cause_id: null,
  cause_name: null,
  comment: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  created_at: null,
  damage_price: null,
  driver_fio: null,
  driver_id: null,
  drivers_license: null,
  employee_position_name: null,
  files: [],
  id: null,
  is_guilty: false,
  special_license: null,
  updated_at: null,
};

export const getDefaultRoadAccidentElement: GetDefaultRoadAccidentElement = (element) => {
  const newElement = { ...defaultRoadAccident };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
