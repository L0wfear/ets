import {
  MaintenanceRateService,
} from 'api/Services';
import {
  ICreateMaintenanceRate,
  IMaintenanceRateUpd,
 } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

export const getMaintenanceRate = (type: string) => {
  const payload = {
    type,
  };

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

export const createMaintenanceRate = (type: string, formState: ICreateMaintenanceRate) => {
  const payload = {
    ...formState,
    type,
  };

  return MaintenanceRateService.post(
      payload,
      null,
      'json',
    ).catch((error) => {
      // tslint:disable-next-line:no-console
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    }).then((r) => ({ maintenanceRateList: r.result.rows }));;
};

export const updateMaintenanceRate = (type: string, formState: IMaintenanceRateUpd) => {
  const payload = {
    ...formState,
    type,
  };

  return MaintenanceRateService.path(formState.id).put(
    payload,
    null,
    'json',
  ).catch((error) => {
    // tslint:disable-next-line:no-console
    console.warn(error);

    return {
      result: {
        rows: [],
      },
    };
  }).then((r) => ({ maintenanceRateList: r.result.rows }));
};

export const deleteMaintenanceRate = (id: number) => MaintenanceRateService.path(id).delete(
    {},
    null,
    'json'
  ).catch((error) => {
  // tslint:disable-next-line:no-console
  console.warn(error);
  return {
    result: {
      rows: [],
    },
  };
}).then((r) => ({ maintenanceRateList: r.result.rows }));
