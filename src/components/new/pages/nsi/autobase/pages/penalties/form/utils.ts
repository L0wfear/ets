import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';

export const defaultPenalty: Penalty = {
  article_koap: '',
  company_id: null,
  company_name: '',
  company_short_name: '',
  driver_id: null,
  driver_fio: '',
  files: [],
  id: null,
  is_appealed: false,
  is_paid: false,
  missions: [],
  missions_text: '',
  odps_code: null,
  odps_name: '',
  okrug_id: null,
  okrug_name: '',
  passport_number: '',
  paid_id: null,
  ruling_date: '',
  ruling_number: '',
  sum_to_pay: null,
  violation_datetime: '',
  violation_document_number: null,
  violation_document_type: '',
  violation_document_type_text: '',
  violation_place: '',
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
