import * as React from 'react';

import useForm from "components/@next/@form/hook_selectors/useForm";
import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import { TableMeta } from 'components/new/ui/table_input/TableInput';

const metaTypeId: TableMeta<ValuesOf<Waybill['car_refill']>> = {
  key: 'type_id',
  title: 'Способ заправки',
  format: 'select',
  width: 200,
  options: [],
  uniqValueInCol: true,
};

const metaFuelCardId: TableMeta<ValuesOf<Waybill['car_refill']>> = {
  key: 'fuel_card_id',
  title: 'Топливная карта',
  placeholder: '',
  format: 'select',
  disabledIf: [
    {
      type: 'compare_with_value_in_option',
      path_to_option: 'type_id',
      compareItemPath: 'is_fuel_card_required',
      match: false,
    },
  ],
  resetIf: [
    {
      type: 'compare_with_value_in_option',
      path_to_option: 'type_id',
      compareItemPath: 'is_fuel_card_required',
      match: false,
    },
  ],
  width: 200,
  options: [],
};

const metaValue: TableMeta<ValuesOf<Waybill['car_refill']>> = {
  key: 'value',
  title: 'Выдано, л',
  width: 100,
  format: 'number',
};

export const useWaybillCarRefillMeta = (formDataKey: any) => {
  const store = useForm.useFormDataStore<Waybill>(formDataKey);

  return React.useMemo(
    () => {
      const meta: TableMeta<ValuesOf<Waybill['car_refill']>>[] = [
        {
          ...metaTypeId,
          options: store.refillTypeOptions.options,
        },
        {
          ...metaFuelCardId,
          options: store.carRefillFuelCardsOptions.options,
        },
        metaValue,
      ];

      return meta;
    },
    [
      store.refillTypeOptions.options,
      store.carRefillFuelCardsOptions.options,
    ],
  );
};
