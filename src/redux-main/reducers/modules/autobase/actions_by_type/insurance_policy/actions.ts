import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetInsurancePolicy,
  createSetInsurancePolicy,
  updateSetInsurancePolicy,
  autobaseDeleteInsurancePolicy,
} from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/promise';

/* ---------- InsurancePolicy ---------- */
export const autobaseSetInsurancePolicy = (insurancePolicyList: InsurancePolicy[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      insurancePolicyList,
    }),
  )
);
export const autobaseResetSetInsurancePolicy = () => (dispatch) => (
  dispatch(
    autobaseSetInsurancePolicy([]),
  )
);
export const autobaseGetSetInsurancePolicy = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetInsurancePolicy(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const insurancePolicyGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetInsurancePolicy(payload, { page, path }),
  );

  dispatch(
    autobaseSetInsurancePolicy(data),
  );

  return {
    insurancePolicyList: data,
  };
};
export const autobaseCreateInsurancePolicy: any = (insurancePolicyOld: InsurancePolicy, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: insurancePolicy } = await dispatch({
    type: 'none',
    payload: createSetInsurancePolicy(insurancePolicyOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return insurancePolicy;
};
export const autobaseUpdateInsurancePolicy: any = (insurancePolicyOld: InsurancePolicy, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: insurancePolicy } = await dispatch({
    type: 'none',
    payload: updateSetInsurancePolicy(insurancePolicyOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return insurancePolicy;
};
export const autobaseRemoveInsurancePolicy = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteInsurancePolicy(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
