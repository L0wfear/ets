export const fuel_cards_types = {
  fuel_card_to_archive: 'fuel_card_to_archive',
  fuel_card_from_archive: 'fuel_card_from_archive',
} as const;

export const fuel_cards_types_reverse = Object.entries(fuel_cards_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
