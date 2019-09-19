import { FuelOperationActive } from "./@types/fuelOperations";
import { FuelOperationsService } from "api/Services";
import { get } from 'lodash';

export const promiseCreateFuelOperation = async (fuelOperationNew: FuelOperationActive) => {
  const response = await FuelOperationsService.post(
    {
      ...fuelOperationNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: FuelOperationActive = {
    ...fuelOperationNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateFuelOperation = async (fuelOperationNew: FuelOperationActive) => {
  const response = await FuelOperationsService.put(
    {
      ...fuelOperationNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: FuelOperationActive = {
    ...fuelOperationNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseSubmitFuelOperation = (fuelOperationNew: FuelOperationActive) => {
  if (fuelOperationNew.id) {
    return promiseUpdateFuelOperation(fuelOperationNew);
  }

  return promiseCreateFuelOperation(fuelOperationNew);
};
