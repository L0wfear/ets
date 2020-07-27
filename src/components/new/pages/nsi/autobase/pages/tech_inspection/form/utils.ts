import { isObject, isNullOrUndefined } from 'util';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultTechInspectionElement = (techInspection: TechInspection | null) => TechInspection;

export const defaultTechInspection: TechInspection = {
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
  is_allowed: false,
  id: null,
  note: '',
  okrug_name: null,
  reg_number: '',
  tech_operator: '',
  updated_at: null,
  files: [],
};

export const getDefaultTechInspectionElement: GetDefaultTechInspectionElement = (element) => {
  const newElement = { ...defaultTechInspection };
  if (isObject(element)) {
    Object.keys(defaultTechInspection).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultTechInspection[key];
    });
  }

  return newElement;
};
