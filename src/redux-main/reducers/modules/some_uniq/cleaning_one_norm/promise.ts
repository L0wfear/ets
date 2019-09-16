import { CleaningOneNormService } from 'api/Services';
import { get } from 'lodash';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

export const promiseGetCleaningOneNorm = async (payload) => {
  let response = null;

  try {
    response = await CleaningOneNormService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Norm = get(response, 'result.rows.0', null);

  return data;
};
