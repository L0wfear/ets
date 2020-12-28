import { get } from 'lodash';
import { FuelTypeService} from 'api/Services';
import { FuelTypes, FuelTypesId } from './@types';

export const promiseLoadFuelTypes = async (payload?: {is_fuel_card: boolean;}) => {
  let response = null;
  const newPayload = payload.is_fuel_card ? payload : {};
  //если payload.is_fuel_card == [что угодно], то хэндлер вернет типы топлива без ЭЭ 
  try {
    response = await FuelTypeService.get(newPayload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Array<FuelTypes> = get(response, 'result.rows', []);

  return {
    data: result,
  };
};

export const promiseLoadFuelTypeById = async (id: FuelTypesId) => {
  let response = null;

  try {
    response = await FuelTypeService.path(id).get();
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Array<FuelTypes> = get(response, 'result.rows', []);

  return {
    data: result,
  };
};
