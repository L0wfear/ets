import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';

export const defaultTachographMetrologicalVerification: TachographMetrologicalVerification = {
  comment: '',
  id: null,
  factory_number: '',
  files: [],
  gov_number: '',
  tachograph_brand_name: '',
  tachograph_id: null,
  verification_date: '',
  verification_number: '',
  tachograph_brand_id: null,
};

export const getDefaultTachographMetrologicalVerificationElement = (element: Partial<TachographMetrologicalVerification>): TachographMetrologicalVerification => {
  const newElement = cloneDeep(defaultTachographMetrologicalVerification);
  if (isObject(element)) {
    Object.keys(defaultTachographMetrologicalVerification).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
