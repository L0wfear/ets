import { ModelsService } from 'api/Services';
import { get } from 'lodash';
import { ModelElement } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const promiseGetModelList = async (payload) => {
  let response = null;
  try {
    response = await ModelsService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<ModelElement> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
