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
  return MaintenanceRateService.get(payload);
};

export const createMaintenanceRate = (type: string, formState: ICreateMaintenanceRate) => {
  const payload = {
    ...formState,
    type,
  };

  return MaintenanceRateService.post(
      payload,
      this.getMaintenanceRate.bind(this, type),
      'json',
    );
};

export const updateMaintenanceRate = (type: string, formState: IMaintenanceRateUpd) => {
  const payload = {
    ...formState,
    type,
  };

  return MaintenanceRateService.path(formState.id).put(
    payload,
    this.getMaintenanceRate.bind(this, type),
    'json',
  );
};

export const deleteMaintenanceRate = (type: string, id: number) => {
  return MaintenanceRateService.path(id).delete(
    {},
    this.getMaintenanceRate.bind(this, type),
    'json',
  );
}
