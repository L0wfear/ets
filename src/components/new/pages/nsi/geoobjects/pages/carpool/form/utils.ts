import { isObject, isNullOrUndefined } from 'util';
import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';

export type GetDefaultCarpoolElement = (batteryBrand: Carpool | null) => Carpool;

export const defaultCarpool: Carpool = {
  address: '',
  company_name: '',
  contractor_id: null,
  id: null,
  name: '',
  okrug_name: null,
  shape: {},
};

export const getDefaultCarpoolElement: GetDefaultCarpoolElement = (element) => {
  const newElement = { ...defaultCarpool };
  if (isObject(element)) {
    Object.keys(defaultCarpool).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCarpool[key];
    });
  }

  return newElement;
};
