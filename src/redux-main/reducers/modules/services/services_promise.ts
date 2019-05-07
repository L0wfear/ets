import { ServicesService } from 'api/Services';
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

export const promisePostServiceFiles = async (id: Service['id'], files: any[]) => {
  let response = null;

  try {
    response = await ServicesService.path(id).path('files').post(
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

export const promiseDeleteServiceFileById = async (id: Service['id'], file_id: number) => {
  let response = null;

  try {
    response = await ServicesService.path(id).path('files').path(file_id).delete(
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
