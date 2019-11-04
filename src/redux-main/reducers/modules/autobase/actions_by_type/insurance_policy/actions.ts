import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetInsurancePolicy,
  createSetInsurancePolicy,
  updateSetInsurancePolicy,
  autobaseDeleteInsurancePolicy,
} from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- InsurancePolicy ---------- */
export const autobaseSetInsurancePolicy = (insurancePolicyList: Array<InsurancePolicy>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      insurancePolicyList,
    }),
  )
);
export const autobaseResetSetInsurancePolicy = (): EtsAction<EtsActionReturnType<typeof autobaseSetInsurancePolicy>> => (dispatch) => (
  dispatch(
    autobaseSetInsurancePolicy([]),
  )
);
export const autobaseGetSetInsurancePolicy = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetInsurancePolicy>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSetInsurancePolicy(payload),
    meta,
  )
);
export const insurancePolicyGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetInsurancePolicy>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetInsurancePolicy(payload, meta),
  );

  dispatch(
    autobaseSetInsurancePolicy(result.data),
  );

  return result;
};

export const autobaseCreateInsurancePolicy = (insurancePolicyOld: InsurancePolicy, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetInsurancePolicy>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    createSetInsurancePolicy(insurancePolicyOld),
    meta,
  )
);
export const autobaseUpdateInsurancePolicy = (insurancePolicyOld: InsurancePolicy, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetInsurancePolicy>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    updateSetInsurancePolicy(insurancePolicyOld),
    meta,
  )
);
export const autobaseRemoveInsurancePolicy = (id, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteInsurancePolicy>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    autobaseDeleteInsurancePolicy(id),
    meta,
  )
);
