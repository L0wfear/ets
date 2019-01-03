import { companyStructureSetNewData } from 'redux-main/reducers/modules/company_structure/common';

import {
  getCompanyStructure,
  getCompanyStructureLinear,
} from 'redux-main/reducers/modules/company_structure/promises';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const setCompanyStructure = (companyStructureList: IStateCompanyStructure['companyStructureList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureList,
    }),
  )
);
export const resetSetCompanyStructure = () => (dispatch) => (
  dispatch(
    setCompanyStructure([]),
  )
);
export const getSetCompanyStructure: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getCompanyStructure(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const getAndSetInStoreCompanyStructure = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    getSetCompanyStructure(payload, { page, path }),
  );

  dispatch(
    setCompanyStructure(data),
  );

  return {
    driverList: data,
  };
};

export const setCompanyStructureLinear = (companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureLinearList,
    }),
  )
);
export const resetSetCompanyStructureLinear = () => (dispatch) => (
  dispatch(
    setCompanyStructure([]),
  )
);
export const getSetCompanyStructureLinear: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getCompanyStructureLinear(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const getAndSetInStoreCompanyStructureLinear = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    getSetCompanyStructureLinear(payload, { page, path }),
  );

  dispatch(
    setCompanyStructureLinear(data),
  );

  return {
    driverList: data,
  };
};

export default {
  companyStructureSetNewData,
  setCompanyStructure,
  resetSetCompanyStructure,
  getSetCompanyStructure,
  getAndSetInStoreCompanyStructure,
  setCompanyStructureLinear,
  resetSetCompanyStructureLinear,
  getSetCompanyStructureLinear,
  getAndSetInStoreCompanyStructureLinear,
};
