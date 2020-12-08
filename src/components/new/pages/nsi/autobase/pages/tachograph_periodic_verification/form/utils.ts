import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';

export const defaultTachograph: Tachograph = {
  id: null,
  tachograph_id: null,
  company_id: null,
  company_name: '',
  okrug_name: '',
  company_structure_id: null,
  company_structure_name: '',
  tachograph_brand_name: '',
  factory_number: '',
  gov_number: '',
  verification_number: '',
  calibration_date: '',
  next_calibration_date: '',
  calibration_type: '',
  verification_reason_name: '',
  verification_reason_id: null,
  other_reason: '',
  comment: '',
  calibration_type_name: '',
  files: [],
  dataForValidation: null,
  tachograph_brand_id: null,
};

export const getDefaultTachographElement = (element: Partial<Tachograph>): Tachograph => {
  const newElement = cloneDeep(defaultTachograph);
  if (isObject(element)) {
    Object.keys(defaultTachograph).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
