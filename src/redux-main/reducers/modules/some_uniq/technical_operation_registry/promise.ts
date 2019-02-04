import { TechnicalOperationRegistryService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetTechnicalOperationRegistry = async (payload) => {
  let response = null;
  try {
    response = await TechnicalOperationRegistryService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
