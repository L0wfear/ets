import { CleaningOneNormService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetCleaningOneNorm = async (payload) => {
  let response = null;

  try {
    response = await CleaningOneNormService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, 'result.rows.0', null);

  return data;
};
