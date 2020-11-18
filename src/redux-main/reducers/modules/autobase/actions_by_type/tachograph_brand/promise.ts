import { TachographBrandService } from 'api/Services';
import { get } from 'lodash';
import { TachographBrand } from './@types';

export const promiseGetTachographBrandList = async () => {
  let response = null;
  try {
    response = await TachographBrandService.get();
  } catch (error) {
    //
  }

  const data: Array<TachographBrand> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};