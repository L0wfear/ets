import * as R from 'ramda';

import { IVehicle } from 'api/@types/services/index.h';

import {
  isNotEqualAnd,
  isThreeDigitGovNumber,
  isFourDigitGovNumber,
} from 'utils/functions';

import {
  diffDates,
} from 'utils/dates';

const VALID_VEHICLES_TYPES = {
  GENERATOR: 69,
  COMPRESSOR: 15,
};

// declarative functional approach
const vehicleFilter = (structure_id: string, car_id: number | void) => R.filter<IVehicle>(c =>
  c.asuods_id === car_id
  || (
    (
      !structure_id ||
      c.is_common ||
      c.company_structure_id === structure_id
    )
    && c.available_to_bind
  ),
);

// IVehaicle
const carFilter = (structure_id, car_id) => R.pipe(
  vehicleFilter(structure_id, car_id),
  R.filter<any>(c =>
    !c.is_trailer ||
    [
      VALID_VEHICLES_TYPES.COMPRESSOR,
      VALID_VEHICLES_TYPES.GENERATOR,
    ].includes (c.type_id),
  ),
);
// IVehaicle
const trailerFilter = structure_id => R.pipe(
  vehicleFilter(structure_id, null),
  R.filter<any>(c => c.is_trailer),
);
// <IVehicle, any>
const vehicleMapper = R.map<any, any>(c => ({
  value: c.asuods_id,
  gov_number: c.gov_number,
  label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`,
}));

export const getCars = (structure_id, car_id) => R.pipe(
  carFilter(structure_id, car_id),
  vehicleMapper,
);

export const getTrailers = structure_id => R.pipe(
  trailerFilter(structure_id),
  vehicleMapper,
);

const isNotEmpty = value => isNotEqualAnd([undefined, null, ''], value);
export const driverHasLicenseWithActiveDate = ({ drivers_license, drivers_license_date_end }) => isNotEmpty(drivers_license) && !isNotEmpty(drivers_license_date_end) || (isNotEmpty(drivers_license_date_end) && diffDates(new Date(), drivers_license_date_end) < 0);
export const driverHasSpecialLicenseWithActiveDate = ({ special_license, special_license_date_end }) => isNotEmpty(special_license) && !isNotEmpty(special_license_date_end) || (isNotEmpty(special_license_date_end) && diffDates(new Date(), special_license_date_end) < 0);

export const getDrivers = (state, employeesIndex, driversList) => {
  const licenceSwitcher = R.cond([
    [isThreeDigitGovNumber, R.always(driverHasLicenseWithActiveDate)],
    [isFourDigitGovNumber, R.always(driverHasSpecialLicenseWithActiveDate)],
    [R.T, R.always(R.identity)],
  ]);

  const driverFilter = licenceSwitcher(state.gov_number);

  return driversList
    .filter(driver => (
      (!state.structure_id || ((employeesIndex[driver.id] && employeesIndex[driver.id].is_common) || state.structure_id === driver.company_structure_id)) &&
      driverFilter(driver)
    ))
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
