import { SpecialModelService } from 'api/Services';
import { get } from 'lodash';
import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';

export const promiseGetSpecialModel = async (payload: object) => {
  let response = null;
  try {
    response = await SpecialModelService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: SpecialModel[] = get(response, 'result.rows', []);

  return {
    data,
  };
};
