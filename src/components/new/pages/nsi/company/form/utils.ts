import { isObject, isNullOrUndefined } from 'util';
import { Company } from 'redux-main/reducers/modules/company/@types';

export type GetDefaultCompanyElement = (compnay: Company | null) => Company;

export const defaultCompany: Company = {
  company_id: null,
  company_name: '',
  has_remote_checkup: false,
  id: null,
  okrug_name: '',
  okrug_id: null,
  rgb_color: '',
  short_name: '',
};

export const getDefaultCompanyElement: GetDefaultCompanyElement = (element) => {
  const newElement = { ...defaultCompany };
  if (isObject(element)) {
    Object.keys(defaultCompany).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCompany[key];
    });
  }

  return newElement;
};
