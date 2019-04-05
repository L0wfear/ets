import {
  get,
} from 'lodash';
import { CountryService } from 'api/Services';
import { Country } from './@types';

export const promiseLoadCountry = async (payload: object) => {
  let response = null;

  try {
    response = await CountryService.get(
      { ...payload },
    );
  } catch (error) {
    //
  }

  const CountryList: Country[] = get(response, 'result.rows', []);

  return CountryList;
};
