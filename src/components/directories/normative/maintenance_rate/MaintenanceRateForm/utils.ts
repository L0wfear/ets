import { isObject } from 'util';
import { IMaintenanceRateUpd } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

export type GetDefaultMaintenanceRateElement = (IMaintenanceRateUpd: IMaintenanceRateUpd | null) => IMaintenanceRateUpd;

export const defaultMaintenanceRate: IMaintenanceRateUpd = {
  id: null,
  clean_category_id: null,
  clean_subcategory_id: null,
  maintenance_work_id: null,
  season_id: null,
  technical_operation_id: null,
  type: null,
  value: null,
};

export const getDefaultMaintenanceRateElement: GetDefaultMaintenanceRateElement = (element) => {
  const newElement = { ...defaultMaintenanceRate };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
