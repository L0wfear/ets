import * as React from 'react';
import { keyBy } from 'lodash';
import { useSelector } from 'react-redux';

import useForm from "components/new/utils/context/form/hook_selectors/useForm";
import { WaybillFormStoreType } from "components/new/pages/waybill/form/context/@types";
import useFuelCardsList from 'components/new/utils/hooks/services/useList/useFuelCardsList';
import { Waybill } from "redux-main/reducers/modules/waybill/@types";
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { makeFuelCardIdOptions } from './waybill_car_refill_fuel_cards';

export const useWaybillLoadCarRefillFuelCards = (formDataKey: string) => {
  const {
    car_refill,
    fuel_type,
  } = useForm.useFormDataFormState<Waybill>(formDataKey);
  const userData = useSelector(
    (state: ReduxState) => getSessionState(state).userData,
  );

  const store = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(formDataKey);

  useForm.useFormDataLoadOptions<WaybillFormStoreType, 'fuelCardsList'>(
    formDataKey,
    'fuelCardsList',
    useFuelCardsList(),
  );

  useForm.useFormDataLoadOptions<WaybillFormStoreType, 'carRefillFuelCardsOptions'>(
    formDataKey,
    'carRefillFuelCardsOptions',
    React.useMemo(
      () => {
        const options = makeFuelCardIdOptions(
          store.fuelCardsList.list,
          car_refill,
          fuel_type,
          userData.company_id,
          userData.structure_id,
        );

        return {
          listIndex: keyBy(options.map(({ rowData }) => rowData), 'id'),
          options,
          isLoading: store.fuelCardsList.isLoading,
        };
      },
      [
        store.fuelCardsList,
        car_refill,
        fuel_type,
        userData.company_id,
        userData.structure_id,
      ],
    ),
  );
};
