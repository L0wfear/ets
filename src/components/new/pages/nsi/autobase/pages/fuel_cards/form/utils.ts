import { isObject, isNullOrUndefined } from 'util';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export const defaultFuelCards: FuelCards = {
  id: null,
  number: null,
  fuel_type: null,
  company_id: null,
  company_name: null,
  company: null,
  fuel_type_text: null,
  structure_id: null,
  is_common: false,
  structure_name: null,
};

export const getDefaultFuelCardsElement = (element: Partial<FuelCards>): FuelCards => {
  const newElement = { ...defaultFuelCards };
  if (isObject(element)) {
    Object.keys(defaultFuelCards).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key])
        ? element[key]
        : defaultFuelCards[key];
    });
  }

  return newElement;
};
