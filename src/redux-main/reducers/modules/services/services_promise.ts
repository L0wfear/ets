import { ServicesService, CountryService } from 'api/Services';
import { get } from 'lodash';
import { Service } from './@types/services';

export const promiseChangeServiceActiveStatus = async (slug: string, is_active: boolean) => {
  let response = null;

  try {
    response = await ServicesService.path(slug).path(is_active ? 'on' : 'off').put(
      {},
      false,
      'json',
    );
  } catch (error) {
    throw error;
  }

  const result: Service = get(response, 'result.rows.0', null);

  return result;
};

export const promiseChangeServiceFiles = async (id: Service['id'], files: any[]) => {
  let response = null;

  try {
    response = await ServicesService.path(id).put(
      {
        files,
      },
      false,
      'json',
    );
  } catch (error) {
    throw error;
  }

  return response;
};

export const promiseLoadCountry = async () => {
  let response = null;

  try {
    response = await CountryService.get();
  } catch (error) {
    console.error('Error', error); // tslint:disable-line
  }

  const result = get(response, 'result.rows', []);

  return {
    list: result,
  };
};
