import {
  getTomorrow9am,
  getDateWithMoscowTz,
  createValidDateTime,
} from 'components/@next/@utils/dates/dates';

export function getDefaultBill({ company_id = null }) {
  // TODO change fuel type to default from app config
  return {
    status: null,
    plan_departure_date: createValidDateTime(getDateWithMoscowTz()),
    plan_arrival_date: createValidDateTime(getTomorrow9am()),
    driver_id: null,
    car_id: null,
    fuel_type: 'DT',
    fuel_start: null,
    equipment_fuel: null,
    equipment_fuel_type: null,
    odometr_start: null,
    motohours_start: null,
    mission_id_list: [],
    car_refill: [],
    equipment_refill: [],
    company_id,
    is_one_fuel_tank: null,
    fuel_given: 0,
  };
}
