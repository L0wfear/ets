import { InsuranceType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getInsuranceType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_type/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- InsuranceType ---------- */
export const autobaseSetInsuranceType = (insuranceTypeList: Array<InsuranceType>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      insuranceTypeList,
    }),
  )
);
export const autobaseResetSetInsuranceType = (): EtsAction<EtsActionReturnType<typeof autobaseSetInsuranceType>> => (dispatch) => (
  dispatch(
    autobaseSetInsuranceType([]),
  )
);
export const autobaseGetInsuranceType = (payload: Parameters<typeof getInsuranceType>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getInsuranceType>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getInsuranceType(payload),
    meta,
  )
);
export const insuranceTypeGetAndSetInStore = (...arg: Parameters<typeof autobaseGetInsuranceType>): EtsAction<EtsActionReturnType<typeof autobaseGetInsuranceType>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetInsuranceType(...arg),
  );

  dispatch(
    autobaseSetInsuranceType(result.data),
  );

  return result;
};
