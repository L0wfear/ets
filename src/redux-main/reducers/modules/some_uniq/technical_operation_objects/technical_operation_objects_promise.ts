import { TechnicalOperationObjectsService } from 'api/Services';
import { get } from 'lodash';
import { TechnicalOperationObjects } from './@types/technical_operation_objects';

export const promiseGetTechnicalOperationObjects = async (payload: any) => {
  let response = null;
  try {
    response = await TechnicalOperationObjectsService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Array<TechnicalOperationObjects> = get(response, 'result.rows', []);

  return data;
};
