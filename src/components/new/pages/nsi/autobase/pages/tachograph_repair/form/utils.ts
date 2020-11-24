import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { TachographRepair } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';

export const defaultTachographRepair: TachographRepair = {
  comment: '',
  factory_number: '',
  gov_number: '',
  id: null,
  repair_date: '',
  repair_reason_id: null,
  repair_reason_name: '',
  tachograph_brand_name: '',
  tachograph_id: null,
  tachograph_brand_id: null,
};

export const getDefaultTachographRepairElement = (element: Partial<TachographRepair>): TachographRepair => {
  const newElement = cloneDeep(defaultTachographRepair);
  if (isObject(element)) {
    Object.keys(defaultTachographRepair).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
