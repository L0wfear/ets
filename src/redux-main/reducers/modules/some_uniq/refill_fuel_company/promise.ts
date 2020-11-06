import { RefillFuelCompanyService } from 'api/Services';
import { get } from 'lodash';
import { OneRefillFuelCompanyData } from 'redux-main/reducers/modules/some_uniq/refill_fuel_company/@types';

export const promiseGetRefillFuelCompany = async (payload) => {
  let response = null;

  try {
    response = await RefillFuelCompanyService.get(payload).catch(
      () => {
        throw new Error('invalid RefillFuelCompanyService');
      },
    );
  } catch {
    //
  }

  const result: OneRefillFuelCompanyData = {
    refills: get(response, 'result.refills'),
    rrn_codes: get(response, 'result.rrn_codes'),
  };

  return result;
};

