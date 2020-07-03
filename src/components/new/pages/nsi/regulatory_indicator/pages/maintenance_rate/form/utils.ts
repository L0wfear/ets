import { isObject } from 'util';
import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

export const defaultMaintenanceRate: MaintenanceRate = {
  clean_category_id: null,
  clean_category_name: '',
  clean_subcategory_id: null,
  clean_subcategory_name: '',
  cleanpsubcategory_id: null,
  company_id: null,
  company_name: null,
  id: null,
  maintenance_work_id: null,
  maintenance_work_name: '',
  measure_unit_id: null,
  measure_unit_name: '',
  okrug_name: null,
  season_id: null,
  season_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  type: '',
  value: null,
};

export const getDefaultMaintenanceRateElement = (element: Partial<MaintenanceRate>) => {
  const newElement = { ...defaultMaintenanceRate };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
