import { isObject, isNullOrUndefined } from 'util';
import { TechMaint } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type GetDefaultTechMaintElement = (techMaint: TechMaint | null) => TechMaint;

export const defaultTechMaint: TechMaint = {
  can_edit: true,
  car_id: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  fact_date_end: null,
  fact_date_start:  null,
  gov_number: null,
  id: null,
  motohours_fact: null,
  note: '',
  number: null,
  odometr_fact: null,
  plan_date_end: null,
  plan_date_start: null,
  repair_company_id: null,
  repair_company_name: null,
  tech_maintenance_order_ids: [],
  tech_maintenance_orders: [],
  tech_maintenance_orders_text: null,
  files: [],
};

export const getDefaultTechMaintElement: GetDefaultTechMaintElement = (element) => {
  const newElement = { ...defaultTechMaint };
  if (isObject(element)) {
    Object.keys(defaultTechMaint).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultTechMaint[key];
    });
  }

  return newElement;
};
