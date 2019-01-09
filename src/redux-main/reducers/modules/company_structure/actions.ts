import { companyStructureSetNewData } from 'redux-main/reducers/modules/company_structure/common';

import {
  getCompanyStructure,
  getCompanyStructureLinear,
  getCompanyStructureDescendantsByUser,
  promiseCreateCompanyStructure,
  promiseUpdateCompanyStructure,
  promiseDeleteCompanyStructure,
} from 'redux-main/reducers/modules/company_structure/promises';
import { IStateCompanyStructure, CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

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
    companyStructureList: data,
  };
};
export const createCompanyStructure: any = (companyStructureRaw: CompanyStructureLinear, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { companyStructure } } = await dispatch({
    type: 'none',
    payload: promiseCreateCompanyStructure(companyStructureRaw),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return companyStructure;
};
export const updateCompanyStructure: any = (companyStructureOld: CompanyStructureLinear, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { companyStructure } } = await dispatch({
    type: 'none',
    payload: promiseUpdateCompanyStructure(companyStructureOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return companyStructure;
};
export const removeCompanyStructure = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseDeleteCompanyStructure(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

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
export const getAndSetInStoreCompanyStructureLinear: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    getSetCompanyStructureLinear(payload, { page, path }),
  );

  dispatch(
    setCompanyStructureLinear(data),
  );

  return {
    companyStructureLinearList: data,
  };
};

export const setCompanyStructureDescendantsByUser = (companyStructureDescendantsByUserList: IStateCompanyStructure['companyStructureDescendantsByUserList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureDescendantsByUserList,
    }),
  )
);
export const getSetCompanyStructureDescendantsByUser: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getCompanyStructureDescendantsByUser(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const getAndSetInStoreCompanyStructureDescendantsByUser = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    getSetCompanyStructureDescendantsByUser(payload, { page, path }),
  );

  dispatch(
    setCompanyStructureDescendantsByUser(data),
  );

  return {
    companyStructureDescendantsByUserList: data,
  };
};

export const resetSetCompanyStructureAll = () => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureList: [],
      companyStructureLinearList: [],
      companyStructureDescendantsByUserList: [],
    }),
  )
);

export default {
  companyStructureSetNewData,
  setCompanyStructure,
  resetSetCompanyStructure,
  getSetCompanyStructure,
  getAndSetInStoreCompanyStructure,
  createCompanyStructure,
  updateCompanyStructure,
  removeCompanyStructure,
  setCompanyStructureLinear,
  resetSetCompanyStructureLinear,
  getSetCompanyStructureLinear,
  getAndSetInStoreCompanyStructureLinear,
  setCompanyStructureDescendantsByUser,
  getSetCompanyStructureDescendantsByUser,
  getAndSetInStoreCompanyStructureDescendantsByUser,
  resetSetCompanyStructureAll,
};
