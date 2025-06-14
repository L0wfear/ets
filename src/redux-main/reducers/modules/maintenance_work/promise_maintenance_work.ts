import { get } from 'lodash';
import { MaintenanceWorkService } from 'api/Services';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';

export const submitMaintenanceWork = async (maintenanceWork: MaintenanceWork) => {
  let response = null;

  if (maintenanceWork.id) {
    response = await MaintenanceWorkService.path(maintenanceWork.id).put(
      {
        ...maintenanceWork,
      },
      false,
      'json',
    );
  } else {
    response = await MaintenanceWorkService.post(
      {
        ...maintenanceWork,
        is_active: true,
      },
      false,
      'json',
    );
  }

  const result: MaintenanceWork = {
    ...maintenanceWork,
    ...get(response, 'result.0', {}),
  };

  return result;
};
