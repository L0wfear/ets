import { isObject, isNullOrUndefined } from 'util';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';

export const defaultContractor: Contractor = {
  bik: '',
  email: '',
  fax: '',
  id: null,
  inn: '',
  kpp: '',
  name: '',
  ogrn: '',
  okpo: '',
  phone: '',
  postal_address: '',
};

export const getDefaultContractorElement = (element: Partial<Contractor>): Contractor => {
  const newElement = { ...defaultContractor };
  if (isObject(element)) {
    Object.keys(defaultContractor).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultContractor[key];
    });
  }

  return newElement;
};
