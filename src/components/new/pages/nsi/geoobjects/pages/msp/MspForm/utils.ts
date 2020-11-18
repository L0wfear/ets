import { isObject, isNullOrUndefined } from 'util';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

export type GetDefaultMspElement = (msp: Msp | null) => Msp;

export const defaultMsp: Msp = {
  address: '',
  company_name: '',
  id: null,
  is_mobile: 1,
  name: '',
  okrug_name: '',
  productivity: null,
  shape: {},
  shortname: '',
};

export const getDefaultMspFormElement: GetDefaultMspElement = (element) => {
  const newElement = { ...defaultMsp };
  if (isObject(element)) {
    Object.keys(defaultMsp).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultMsp[key];
    });
  }

  return newElement;
};
