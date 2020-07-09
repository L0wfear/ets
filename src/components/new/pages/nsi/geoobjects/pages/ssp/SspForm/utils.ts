import { isObject, isNullOrUndefined } from 'util';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';

export type GetDefaultSspElement = (ssp: Ssp | null) => Ssp;

export const defaultSsp: Ssp = {
  address: '',
  company_name: '',
  id: null,
  is_mobile: 1,
  name: '',
  okrug_name: null,
  productivity: null,
  shape: {},
  shortname: '',
};

export const getDefaultSspFormElement: GetDefaultSspElement = (element) => {
  const newElement = { ...defaultSsp };
  if (isObject(element)) {
    Object.keys(defaultSsp).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultSsp[key];
    });
  }

  return newElement;
};
