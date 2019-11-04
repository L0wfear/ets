import { WorkKindService } from 'api/Services';
import { get } from 'lodash';
import { WorkKind } from './@types/work_kind';

export const promiseGetWorkKind = async (payload: any) => {
  let response = null;
  try {
    response = await WorkKindService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Array<WorkKind> = get(response, 'result.rows', []);

  return data;
};
