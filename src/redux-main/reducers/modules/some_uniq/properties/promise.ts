import { CleaningRatePropertieService } from 'api/Services';
import { get } from 'lodash';
import { CleaningRatePropertie } from 'redux-main/reducers/modules/some_uniq/properties/@types';

export const promiseGetCleaningRatePropertie = async (type: CleaningRatePropertie['type']) => {
  let response = null;
  try {
    response = await CleaningRatePropertieService.get({type});
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Array<CleaningRatePropertie> = get(response, 'result.rows');

  return {
    data,
  };
};
