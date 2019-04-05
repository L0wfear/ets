import { isObject, isNullOrUndefined } from 'util';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultRepairCompany: RepairCompany = {
  comment: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  id: null,
  name: null,
};

export const getDefaultRepairCompanyElement = (element: Partial<RepairCompany>): RepairCompany => {
  const newElement = { ...defaultRepairCompany };
  if (isObject(element)) {
    Object.keys(defaultRepairCompany).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultRepairCompany[key];
    });
  }

  return newElement;
};
