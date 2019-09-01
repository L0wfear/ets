import {
  MaterialConsumptionRateService,
} from 'api/Services';
import {
  MaterialConsumptionRate,
 } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import { get } from 'lodash';

export const getMaterialConsumptionRate = (payload = {}): Promise<{ materialConsumptionRateList: MaterialConsumptionRate[] }> => {
  return MaterialConsumptionRateService
    .get(payload)
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    }).then((r) => ({ materialConsumptionRateList: r.result.rows }));
};

export const createMaterialConsumptionRate = async (payload: MaterialConsumptionRate) => {
  const response = await MaterialConsumptionRateService.post(
    payload,
    false,
    'json',
  );
  const materialConsumptionRateList: MaterialConsumptionRate = get(
    response,
    'result.rows.0',
    null,
  );
  return { materialConsumptionRateList };
};

export const updateMaterialConsumptionRate = async (payload) => {

  const elementId = get(payload, 'id', null);
  const response = await MaterialConsumptionRateService.path(elementId).put(
    payload,
    false,
    'json',
  );

  const materialConsumptionRateList: MaterialConsumptionRate = get(
    response,
    'result.rows.0',
    null,
  );

  return { materialConsumptionRateList };
};

export const deleteMaterialConsumptionRate = (id: number) => {
  return MaterialConsumptionRateService.path(id).delete(
    {},
    false,
    'json',
  );
};
