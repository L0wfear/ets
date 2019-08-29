import { TechnicalOperationRegistryService } from 'api/Services';
import { get } from 'lodash';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';

export const promiseGetTechnicalOperationRegistry = async (payload) => {
  let response = null;
  try {
    response = await TechnicalOperationRegistryService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: TechnicalOperationRegistry[] = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
