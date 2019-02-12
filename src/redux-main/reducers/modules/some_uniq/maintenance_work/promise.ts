import { MaintenanceWorkService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetMaintenanceWork = async (payload) => {
  let response = null;
  try {
    response = await MaintenanceWorkService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
