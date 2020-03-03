import { isObject, isNullOrUndefined } from 'util';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export const defaultFuelCard: FuelCard = {
  id: null,
  number: null,
  fuel_type: null,
  company_id: null,
  company_name: null,
  company_short_name: null,
  company: null,
  fuel_type_text: null,
  structure_id: null,
  is_archive: false,
  is_common: false,
  is_used_in_waybill: false,
  structure_name: null,
  released_at: null,
  date_end: null,
  car_id: null,
  gov_number_text: null,
  gov_number: null,
};

export const getDefaultFuelCardElement = (element: Partial<FuelCard>): FuelCard => {
  const newElement = { ...defaultFuelCard };
  if (isObject(element)) {
    Object.keys(defaultFuelCard).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key])
        ? element[key]
        : defaultFuelCard[key];
    });
  }

  return newElement;
};
