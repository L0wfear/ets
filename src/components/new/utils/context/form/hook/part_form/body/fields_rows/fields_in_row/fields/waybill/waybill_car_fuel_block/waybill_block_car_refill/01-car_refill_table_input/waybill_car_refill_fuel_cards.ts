import memoizeOne from 'memoize-one';

import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

export const makeFuelCardStrickOptions = memoizeOne(
  (
    fuelCardsList: FuelCard[],
    fuel_type: Waybill['fuel_type'],
    userCompanyId: InitialStateSession['userData']['company_id'],
    userStructureId: InitialStateSession['userData']['structure_id'],
  ) => {
    return fuelCardsList.reduce<DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>[]>(
      (newArr, rowData) => {
        const triggerOnShow = (
          !rowData.is_archive
            && (
              fuel_type === rowData.fuel_type
              || !fuel_type
            )
            && (
              !userCompanyId
              || rowData.company_id === userCompanyId
              && (
                !userStructureId
                || userStructureId === rowData.structure_id
                || rowData.is_common
              )
            )
        );

        if (triggerOnShow) {
          newArr.push({
            value: rowData.id,
            label: rowData.number,
            rowData,
          });
        }

        return newArr;
      },
      [],
    );
  },
);

export const makeFuelCardIdOptions = memoizeOne(
  (
    fuelCardsList: FuelCard[],
    car_refill: Waybill['car_refill'] | Waybill['equipment_refill'],
    fuel_type: Waybill['fuel_type'],
    userCompanyId: InitialStateSession['userData']['company_id'],
    userStructureId: InitialStateSession['userData']['structure_id'],
  ) => {
    return fuelCardsList.reduce<{ value: FuelCard['id'], label: FuelCard['number'], rowData: FuelCard }[]>(
      (newArr, rowData) => {
        const triggerOnShow = (
          (
            fuel_type === rowData.fuel_type
            || !fuel_type
          ) && (
            !userCompanyId
            || rowData.company_id === userCompanyId
            && (
              !userStructureId
              || userStructureId === rowData.structure_id
              || rowData.is_common
            )
          ) || (
            car_refill.some((refill) => refill.fuel_card_id === rowData.id)
          )
        );

        if (triggerOnShow) {
          newArr.push({
            value: rowData.id,
            label: rowData.number,
            rowData,
          });
        }

        return newArr;
      },
      [],
    );
  },
);
