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
  gov_numbers_text: null,
  gov_numbers: [],
  id: null,
  insurance_type_id: null,
  insurance_type_name: null,
  insurer: null,
  note: null,
  number: null,
  okrug_name: null,
  price: null,
  seria: null,
  updated_at: null,
  files: [],
};

export const getDefaultInsurancePolicyElement: GetDefaultInsurancePolicyElement = (element) => {
  const newElement = { ...defaultInsurancePolicy };
  if (isObject(element)) {
    Object.keys(defaultInsurancePolicy).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultInsurancePolicy[key];
    });
  }

  return newElement;
};
