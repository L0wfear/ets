import { TechnicalOperationTypesService } from 'api/Services';
import { get } from 'lodash';
import { TechnicalOperationTypes } from './@types/technical_operation_types';

export const promiseGetTechnicalOperationTypes = async (payload: any) => {
  let response = null;
  try {
    response = await TechnicalOperationTypesService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: TechnicalOperationTypes[] = get(response, 'result', []);

  return data;
};
