import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { someUniqSetNewData } from '../common';
import { IStateSomeUniq } from '../@types/some_uniq.h';
import { promiseGetRefillFuelCompany } from 'redux-main/reducers/modules/some_uniq/refill_fuel_company/promise';

export const actionLoadRefillFuelCompany = (payload: object, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetRefillFuelCompany>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetRefillFuelCompany(payload),
    meta,
  )
);

export const actionSetRefillFuelCompany = (refillFuelCompany: IStateSomeUniq['refillFuelCompany']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      refillFuelCompany,
    }),
  )
);
export const actionResetRefillFuelCompany = (): EtsAction<EtsActionReturnType<typeof actionSetRefillFuelCompany>> => (dispatch) => (
  dispatch(
    actionSetRefillFuelCompany({
      refills: [],
      rrn_codes: [],
    }),
  )
);

export const actionGetAndSetInStoreRefillFuelCompany = (...arg: Parameters<typeof actionLoadRefillFuelCompany>): EtsAction<EtsActionReturnType<typeof actionLoadRefillFuelCompany>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadRefillFuelCompany(...arg),
  );

  dispatch(
    actionSetRefillFuelCompany(result),
  );

  return result;
};
