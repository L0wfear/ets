import { isObject, isNullOrUndefined } from 'util';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultInsurancePolicyElement = (insurancePolicy: InsurancePolicy | null) => InsurancePolicy;

export const defaultInsurancePolicy: InsurancePolicy = {
  car_id: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  created_at: null,
  date_end: null,
  date_start: null,
  gov_number: null,
  id: null,
  insurance_type_id: null,
  insurance_type_name: null,
  insurer: null,
  note: null,
  number: null,
  price: null,
  seria: null,
  updated_at: null,
  files: [],
};

export const getDefaultInsurancePolicyElement: GetDefaultInsurancePolicyElement = (element) => {
  const newElement = { ...defaultInsurancePolicy };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = !isNullOrUndefined(value) ? value : defaultInsurancePolicy[key];
    });
  }

  return newElement;
};
