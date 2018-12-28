import { SpecialModelService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetSpecialModel = async (payload) => {
  let response = null;
  try {
    response = await SpecialModelService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
