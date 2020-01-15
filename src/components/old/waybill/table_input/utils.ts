import memoizeOne from 'memoize-one';
import { keyBy } from 'lodash';

import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

export const makeFuelCardIdOptions = memoizeOne(
  (
    fuelCardsList: FuelCard[],
    car_refill: Waybill['car_refill'],
    notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
  ) => {
    const car_refillIndex = keyBy(car_refill, 'fuel_card_id');
    const option = fuelCardsList.reduce<DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>[]>(
      (newArr, rowData) => {

        delete car_refillIndex[rowData.id];

        newArr.push({
          value: rowData.id,
          label: rowData.number,
          rowData,
        });

        return newArr;
      },
      [],
    );

    Object.keys(car_refillIndex).forEach(
      (key) => {
        if (notFiltredFuelCardsIndex[key]) {
          option.push({
            value: notFiltredFuelCardsIndex[key].id,
            label: notFiltredFuelCardsIndex[key].number,
            rowData: notFiltredFuelCardsIndex[key],
            isNotVisible: true,
          });
        }
      },
    );

    return option;
  },
);
