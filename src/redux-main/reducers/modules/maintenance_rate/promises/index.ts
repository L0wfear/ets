import {
  MaintenanceRateService,
} from 'api/Services';
import {
  MaintenanceRate,
} from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { get } from 'lodash';

export const getMaintenanceRate = (payload = {}): Promise<{ maintenanceRateList: Array<MaintenanceRate>; }> => {
  return MaintenanceRateService
    .get({ ...payload })
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

export const createMaintenanceRate = async (payload: MaintenanceRate) => {
  const response = await MaintenanceRateService.post(
    { ...payload },
    false,
    'json',
  );
  const maintenanceRate: MaintenanceRate = get(
    response,
    'result.rows.0',
    response?.result,
  );

  return maintenanceRate;
};

export const updateMaintenanceRate = async (payload) => {

  const elementId = get(payload, 'id', null);
  const response = await MaintenanceRateService.path(elementId).put(
    { ...payload },
    false,
    'json',
  );

  const maintenanceRate: MaintenanceRate = get(
    response,
    'result.rows.0',
    response?.result,
  );

  return maintenanceRate;
};

export const deleteMaintenanceRate = (id: MaintenanceRate['id']) => {
  return MaintenanceRateService.path(id).delete(
    {},
    false,
    'json',
  );
};
