import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import memoizeOne from 'memoize-one';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const makeFuelCardIdOptions = memoizeOne(
  (
    fuelCardsList: FuelCard[],
  ) => {
    return fuelCardsList.reduce<DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>[]>(
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
