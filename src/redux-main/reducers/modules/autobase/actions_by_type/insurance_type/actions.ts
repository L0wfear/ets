import { InsuranceType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getInsuranceType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_type/promise';

/* ---------- InsuranceType ---------- */
export const autobaseSetInsuranceType = (insuranceTypeList: InsuranceType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      insuranceTypeList,
    }),
  )
);
export const autobaseResetSetInsuranceType = () => (dispatch) => (
  dispatch(
    autobaseSetInsuranceType([]),
  )
);
export const autobaseGetInsuranceType: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getInsuranceType(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const insuranceTypeGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetInsuranceType(payload, { page, path }),
  );

  dispatch(
    autobaseSetInsuranceType(data),
  );

  return {
    insuranceTypeList: data,
  };
};
