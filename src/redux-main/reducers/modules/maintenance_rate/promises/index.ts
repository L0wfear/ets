import {
  MaintenanceRateService,
} from 'api/Services';
import {
  ICreateMaintenanceRate,
 } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { get } from 'lodash';

export const getMaintenanceRate = (payload = {}) => {
  return MaintenanceRateService
    .get(payload)
    .catch((error) => {
      // tslint:disable-next-line:no-console
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    }).then((r) => ({ maintenanceRateList: r.result.rows }));
};

export const createMaintenanceRate = async (payload: ICreateMaintenanceRate) => {
  const response = await MaintenanceRateService.post(
    payload,
    false,
    'json',
  );
  const maintenanceRateList = get(
    response,
    'result.rows',
    {
      result: {
        rows: [],
      },
    },
  );
  return { maintenanceRateList };
};

export const updateMaintenanceRate = async (payload) => {

  const elementId = get(payload, 'id', null);
  const response = await MaintenanceRateService.path(elementId).put(
    payload,
    false,
    'json',
  );

  const maintenanceRateList = get(
    response,
    'result.rows',
    {
      result: {
        rows: [],
      },
    },
  );

  return { maintenanceRateList };
};

export const deleteMaintenanceRate = ( id: number ) => {
  return MaintenanceRateService.path(id).delete(
    {},
    false,
    'json',
  );
};
