import { isObject, isNullOrUndefined } from 'util';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { get } from 'lodash';
import { AUTOBASE_REPAIR_STATUS, failed } from 'redux-main/reducers/modules/autobase/actions_by_type/repair/status';

export type GetDefaultRepairElement = (repair: Repair | null) => Repair;

export const defaultRepair: Repair = {
  can_edit: true,
  car_id: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  description:  null,
  fact_date_end: null,
  fact_date_start: null,
  files: [],
  gov_number: null,
  id: null,
  note: null,
  number: null,
  plan_date_end: null,
  plan_date_start: null,
  repair_company_id: null,
  repair_company_name: null,
  repair_type_id: null,
  repair_type_name: null,
  status: null,
};

export const getDefaultRepairElement: GetDefaultRepairElement = (element) => {
  const newElement = { ...defaultRepair };
  if (isObject(element)) {
    Object.keys(defaultRepair).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultRepair[key];
    });
  }

  const triggerOnFaildStatus = (
    !AUTOBASE_REPAIR_STATUS[newElement.status]
    || (
      get(AUTOBASE_REPAIR_STATUS, [newElement.status, 'disabled'], false)
    )
  );

  if (triggerOnFaildStatus) {
    newElement.status = failed;
  }

  return newElement;
};
