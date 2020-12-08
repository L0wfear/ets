import { isObject, isNullOrUndefined } from 'util';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import * as React from 'react';
import { actionFuelTypesGetAndSetInStore, actionFuelTypesByIdGetAndSetInStore } from 'redux-main/reducers/modules/some_uniq/fuel_types/actions';
import { FuelTypes, FuelTypesId } from 'redux-main/reducers/modules/some_uniq/fuel_types/@types';

export type FuelTypeOptions = Array<{
  value: FuelTypesId;
  label: FuelTypes['name'];
  rowData: {
    [K in keyof FuelTypes]
  };
}>;

export const defaultFuelCard: FuelCard = {
  id: null,
  number: null,
  fuel_type: null,
  fuel_types: [],
  company_id: null,
  company_name: null,
  company_short_name: null,
  company: null,
  composite_id: null,
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
  garage_number: null,
  fuel_card_on_cars: [],
  origin_fuel_card_on_cars: [],
  okrug_name: null,
  source_type_id: null,
  source_type_text: null,
  status: null,
  status_text: null,
  comment: null,
};

export const getDefaultFuelCardElement = (element: Partial<FuelCard>): FuelCard => {
  const newElement = { ...defaultFuelCard };
  if (isObject(element)) {
    Object.keys(defaultFuelCard).forEach((key) => {
      if (key === 'fuel_card_on_cars') {
        if (!isNullOrUndefined(element[key])) {
          newElement[key] = element[key].map((rowData, index) => {
            return {
              ...rowData,
              customId: index + 1,
              alredy_save: rowData.alredy_save ?? true
            };
          });
        } else {
          newElement[key] = !isNullOrUndefined(element[key])
            ? element[key]
            : defaultFuelCard[key];
        }
      } else {
        newElement[key] = !isNullOrUndefined(element[key])
          ? element[key]
          : defaultFuelCard[key];
      }
    });
  }

  return newElement;
};

export const usefuelTypeOptions = (page: string, params: {id?: FuelTypesId; is_fuel_card?: boolean;}): FuelTypeOptions => {
  const dispatch = etsUseDispatch();
  const [fuelTypes, setFuelTypes] = React.useState<Array<FuelTypes>>([]);
  React.useEffect(() => {
    ( async () => {
      if (params.id) {
        const fuelTypes = await (await dispatch(actionFuelTypesByIdGetAndSetInStore(params.id, {page})))?.data;
        setFuelTypes(fuelTypes);
      } else {
        const fuelTypes = await (await dispatch(actionFuelTypesGetAndSetInStore({is_fuel_card: params.is_fuel_card }, {page})))?.data;
        setFuelTypes(fuelTypes);
      }
    })();
  }, []);

  const fuelTypeOptions = React.useMemo(() => {
    return fuelTypes.map((el) => (
      {
        value: el.id,
        label: el.name,
        rowData: {
          ...el
        },
      }
    ));
  }, [fuelTypes]);
  return fuelTypeOptions;
};
