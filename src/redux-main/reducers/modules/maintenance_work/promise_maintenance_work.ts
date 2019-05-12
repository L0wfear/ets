import { MaintenanceWork } from "./@types/maintenanceWork";
import { MaintenanceWorkService } from "api/Services";
import { get } from 'lodash';

export const promiseCreateMaintenanceWork = async (maintenanceWorkNew: MaintenanceWork) => {
  const response = await MaintenanceWorkService.post(
    {
      ...maintenanceWorkNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: MaintenanceWork = {
    ...maintenanceWorkNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateMaintenanceWork = async (maintenanceWork: MaintenanceWork) => {
  const response = await MaintenanceWorkService.path(maintenanceWork.id).put(
    {
      ...maintenanceWork,
    },
    false,
    'json',
  );

  const result: MaintenanceWork = {
    ...maintenanceWork,
    ...get(response, 'result.0', {}),
  };

  return result;
};

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
