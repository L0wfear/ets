import * as R from 'ramda';
import * as moment from 'moment';

import { IVehicle } from 'api/@types/services/index.h';

import {
  isNotEqualAnd,
  hasMotohours,
} from 'utils/functions';

const VALID_VEHICLES_TYPES = {
  GENERATOR: 69,
  COMPRESSOR: 15,
};

// declarative functional approach
const vehicleFilter = (structure_id: string) => R.filter<IVehicle>(c =>
  !structure_id ||
  c.is_common ||
  c.company_structure_id === structure_id,
);

// todo вернуть интерфес
//  R.filter<IVehicle>(c =>
const carFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<any>(c =>
    !c.is_trailer ||
    [
      VALID_VEHICLES_TYPES.COMPRESSOR,
      VALID_VEHICLES_TYPES.GENERATOR,
    ].includes (c.type_id),
  ),
);
// todo вернуть интерфейс
//  R.filter<IVehicle>(c => c.is_trailer),
const trailerFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<any>(c => c.is_trailer),
);

// <IVehicle, any>
const vehicleMapper = R.map<any, any>(c => ({
  value: c.asuods_id,
  model_id: c.model_id,
  gov_number: c.gov_number,
  label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}${c.type_name ? '/' : ''}${c.type_name || ''}]`,
}));

export const getCars = structure_id => R.pipe(
  carFilter(structure_id),
  vehicleMapper,
);

export const getTrailers = structure_id => R.pipe(
  trailerFilter(structure_id),
  vehicleMapper,
);

const isNotEmpty = value => isNotEqualAnd([undefined, null, ''], value);
export const driverHasLicense = ({ drivers_license }) => isNotEmpty(drivers_license);
export const driverHasSpecialLicense = ({ special_license }) => isNotEmpty(special_license);

const hasOdometr = ({ gov_number }) => !hasMotohours(gov_number);

export const getDrivers = (state: any = {}, driversList) => {
  const licenceSwitcher = R.cond([
    [hasOdometr, R.always(driverHasLicense)],
    [hasMotohours, R.always(driverHasSpecialLicense)],
    [R.T, R.always(R.identity)],
  ]);

  const driverFilter = licenceSwitcher(state);

  return driversList
    .filter(d => (!d.prefer_car ? true : d.prefer_car === state.car_id) && driverFilter(d))
    .map(d => {
      const personnel_number = d.personnel_number ? `[${d.personnel_number}] ` : '';
      return {
        value: d.id,
        label: `${personnel_number}${d.last_name || ''} ${d.first_name || ''} ${d.middle_name || ''}`,
      };
    });
};

export function validateTaxesControl(taxes: Array<Array<any>>): boolean {
  const isAllTaxesEmpty = taxes.every((tax = []) => tax.length === 0);

  if (isAllTaxesEmpty) {
    return false;
  }

  const nonEmptyTaxes = taxes.filter((tax = []) => tax.length > 0);

  return !nonEmptyTaxes.
    map(taxData =>
      taxData.map(t =>
        t && t.OPERATION !== undefined,
      ).includes(false),
    ).includes(true);
}

export function checkDateMission({ date_start, date_end, dateWaybill: { plan_departure_date, plan_arrival_date } }) {
  if (
    moment(date_end).format(`${global.APP_DATE_FORMAT} HH:mm`) < moment(plan_departure_date).format(`${global.APP_DATE_FORMAT} HH:mm`)
    ||
    moment(plan_arrival_date).format(`${global.APP_DATE_FORMAT} HH:mm`) < moment(date_start).format(`${global.APP_DATE_FORMAT} HH:mm`)
  ) {
    return true;
  }
  return false;
}
