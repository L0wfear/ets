import { isObject, isNullOrUndefined } from 'util';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';

export const defaultMaintenanceWork: MaintenanceWork = {
  id: null,
  name: '',
  measure_unit_id: null,
  measure_unit_name: '',
};

export const getDefaultMaintenanceWorkElement = (element: Partial<MaintenanceWork>): MaintenanceWork => {
  const newElement = { ...defaultMaintenanceWork };
  if (isObject(element)) {
    Object.keys(defaultMaintenanceWork).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultMaintenanceWork[key];
    });
  }

  return newElement;
};
