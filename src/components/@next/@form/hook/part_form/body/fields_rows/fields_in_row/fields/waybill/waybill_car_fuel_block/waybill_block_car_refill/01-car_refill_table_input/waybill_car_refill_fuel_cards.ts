import memoizeOne from 'memoize-one';

import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export const makeFuelCardIdOptions = memoizeOne(
  (
    fuelCardsList: Array<FuelCard>,
  ) => {
    return fuelCardsList.reduce<Array<{ value: FuelCard['id']; label: FuelCard['number']; rowData: FuelCard; }>>(
      (newArr, rowData) => {
        newArr.push({
          value: rowData.id,
          label: rowData.number,
          rowData,
        });
        return newArr;
      },
      [],
    );
  },
);
