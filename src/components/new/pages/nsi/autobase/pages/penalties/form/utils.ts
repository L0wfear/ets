import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';

export const defaultPenalty: Penalty = {
  company_id: null,
  company_name: '',
  company_short_name: '',
  driver_id: null,
  driver_fio: '',
  id: null,
  is_appealed: false,
  missions: [],
  missions_text: '',
  okrug_id: null,
  okrug_name: '',
  violation_datetime: '',
  violation_document_number: null,
  waybills: [],
  waybills_text: '',
};

export const getDefaultPenaltyElement = (element: Partial<Penalty>): Penalty => {
  const newElement = cloneDeep(defaultPenalty);
  if (isObject(element)) {
    Object.keys(defaultPenalty).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
