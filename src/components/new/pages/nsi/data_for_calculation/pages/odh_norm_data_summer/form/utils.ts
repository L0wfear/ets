import { isObject, isNullOrUndefined } from 'util';
import { OdhNormDataSummer } from 'redux-main/reducers/modules/odh_norm_data_summer/@types/odhNormDataSummer';

export const defaultOdhNormDataSummer: OdhNormDataSummer = {
  id: null,
  technical_operation_name: '',
  technical_operation_id: null,
  standard_name: '',
  standard_id: null,
  unit: '',
  categorized_1: '',
  categorized_2: '',
  categorized_3: '',
  categorized_4: '',
  categorized_5: '',
  categorized_6a: '',
  categorized_6b: '',
  categorized_6c: '',
  categorized_7a: '',
  categorized_7b: '',
  uncategorized_highway: '',
  uncategorized_odhs_center: '',
  uncategorized_odhs_other: '',
};

export const getDefaultOdhNormDataSummerElement = (element: Partial<OdhNormDataSummer>): OdhNormDataSummer => {
  const newElement = { ...defaultOdhNormDataSummer };
  if (isObject(element)) {
    Object.keys(defaultOdhNormDataSummer).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultOdhNormDataSummer[key];
    });
  }

  return newElement;
};
