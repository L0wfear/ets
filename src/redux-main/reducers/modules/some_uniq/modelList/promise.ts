import { ModelsService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetModelList = async (payload) => {
  let response = null;
  try {
    response = await ModelsService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
