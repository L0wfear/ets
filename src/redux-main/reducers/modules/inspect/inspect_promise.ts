import { InspectionActService, InspectCarsConditionService } from 'api/Services';
import {
  get,
} from 'lodash';

import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const promiseGetBlobActInspection = async (inspection_id: number, format?: string) => {
  let response = { blob: null };
  const payload = format ? { inspection_id, format, apply_watermark: true } : { inspection_id, apply_watermark: true };
  
  try {
    response = await InspectionActService.getBlob(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  return response;
};

export const promiseUpdatePreparePlan = async (id: number, payload: {types_cars: InspectCarsCondition['data']['types_cars']; types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];}) => {
  const newPayload = {
    ...payload,
  };

  const response = await InspectCarsConditionService.path(`${id}/cars_preparation_plan`).put(
    {
      ...newPayload,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};
