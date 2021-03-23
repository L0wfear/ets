import { isObject, isNullOrUndefined } from 'util';
import { cloneDeep } from 'lodash';
import { Refill } from 'redux-main/reducers/modules/autobase/actions_by_type/refill_registry/@types';

export const defaultRefill: Refill = {
  okrug_id: null,
  okrug_name: '',
  company_id: null,
  company_name: '',
  refill_at: '' ,
  refill_at_text: '',
  fuel_car_id: null,
  fuel_card_number: '',
  fuel_type_id: null,
  fuel_type: '',
  fuel_given: null,
  car_gov_number_text: '',
  tx_id: null,
  waybill_id: null,
  waybill_number: null,
  wb_fuel_card_ids: [],
  wb_fuel_card_numbers: '',
  wb_fuel_types: [],
  wb_fuel_types_text: '',
  gas_station_name: '',
  gas_station_address: '',
  structure_id: null,
  structure_name: '',
  op_type_name: '',
};

export const getDefaultRefillElement = (element: Partial<Refill>): Refill => {
  const newElement = cloneDeep(defaultRefill);
  if (isObject(element)) {
    Object.keys(defaultRefill).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
