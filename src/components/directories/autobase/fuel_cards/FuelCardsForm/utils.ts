import { isObject, isNullOrUndefined } from 'util';
import { FuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export type GetDefaultFuelCardsElement = (sparePart: FuelCards | null) => FuelCards;

export const defaultFuelCards: FuelCards = {
  id: null,
  number: null,
  fuel_type: null,
  company_id: null,
  company_name: null,
  company: null,
  fuel_type_text: null,
};

export const getDefaultFuelCardsElement: GetDefaultFuelCardsElement = (element) => {
  const newElement = { ...defaultFuelCards };
  if (isObject(element)) {
    Object.keys(defaultFuelCards).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultFuelCards[key];
    });
  }

  return newElement;
};
