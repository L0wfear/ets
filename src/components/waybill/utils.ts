import * as R from 'ramda';

import { IVehicleType } from 'api/@types/services/index.h';

import {
  isNotEqualAnd,
  isThreeDigitGovNumber,
  isFourDigitGovNumber,
} from 'utils/functions';

// declarative functional approach
const vehicleFilter = (structure_id: string) => R.filter<IVehicleType>(c =>
  !structure_id ||
  c.is_common ||
  c.company_structure_id === structure_id,
);

const carFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<IVehicleType>(c => !c.is_trailer),
);
const trailerFilter = structure_id => R.pipe(
  vehicleFilter(structure_id),
  R.filter<IVehicleType>(c => c.is_trailer),
);

const vehicleMapper = R.map<IVehicleType, any>(c => ({
  value: c.asuods_id,
  gov_number: c.gov_number,
  label: `${c.gov_number} [${c.special_model_name || ''}${c.special_model_name ? '/' : ''}${c.model_name || ''}]`,
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

export const getDrivers = (gnumber = '', driversList) => {
  const licenceSwitcher = R.cond([
    [isThreeDigitGovNumber, R.always(driverHasLicense)],
    [isFourDigitGovNumber, R.always(driverHasSpecialLicense)],
    [R.T, R.always(R.identity)],
  ]);

  const driverFilter = licenceSwitcher(gnumber);

  return driversList
    .filter(driverFilter)
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
