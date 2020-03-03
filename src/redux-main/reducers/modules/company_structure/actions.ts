import { companyStructureSetNewData } from 'redux-main/reducers/modules/company_structure/common';

import {
  getCompanyStructure,
  getCompanyStructureLinear,
  getCompanyStructureDescendantsByUser,
  promiseCreateCompanyStructure,
  promiseUpdateCompanyStructure,
  promiseDeleteCompanyStructure,
} from 'redux-main/reducers/modules/company_structure/promises';
import { IStateCompanyStructure, CompanyStructureLinear, CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const setCompanyStructure = (companyStructureList: IStateCompanyStructure['companyStructureList']): EtsAction<EtsActionReturnType<typeof companyStructureSetNewData>> => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureList,
    }),
  )
);
export const resetSetCompanyStructure = (): EtsAction<EtsActionReturnType<typeof setCompanyStructure>> => (dispatch) => (
  dispatch(
    setCompanyStructure([]),
  )
);
export const getSetCompanyStructure = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getCompanyStructure>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getCompanyStructure(payload),
    meta,
  )
);
export const getAndSetInStoreCompanyStructure = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getCompanyStructure>> => async (dispatch) => {
  const result = await dispatch(
    getSetCompanyStructure(payload, meta),
  );

  dispatch(
    setCompanyStructure(result.data),
  );

  return result;
};
export const createCompanyStructure = (companyStructureRaw: CompanyStructureLinear, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateCompanyStructure>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCreateCompanyStructure(companyStructureRaw),
    meta,
  );
};
export const updateCompanyStructure = (companyStructureOld: CompanyStructureLinear, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateCompanyStructure>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseUpdateCompanyStructure(companyStructureOld),
    meta,
  );
};

export const removeCompanyStructure = (id: CompanyStructure['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseDeleteCompanyStructure>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseDeleteCompanyStructure(id),
    meta,
  );
};

export const setCompanyStructureLinear = (companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList']) => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureLinearList,
    }),
  )
);
export const resetSetCompanyStructureLinear = (): EtsAction<EtsActionReturnType<typeof setCompanyStructure>> => (dispatch) => (
  dispatch(
    setCompanyStructure([]),
  )
);
export const getSetCompanyStructureLinear = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getCompanyStructureLinear>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getCompanyStructureLinear(payload),
    meta,
  )
);

export const getAndSetInStoreCompanyStructureLinear = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetCompanyStructureLinear>> => async (dispatch) => {
  const result = await dispatch(
    getSetCompanyStructureLinear(payload, meta),
  );

  dispatch(
    setCompanyStructureLinear(result.data),
  );

  return result;
};

export const setCompanyStructureDescendantsByUser = (companyStructureDescendantsByUserList: IStateCompanyStructure['companyStructureDescendantsByUserList']): EtsAction<EtsActionReturnType<typeof companyStructureSetNewData>> => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureDescendantsByUserList,
    }),
  )
);
export const getSetCompanyStructureDescendantsByUser = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getCompanyStructureDescendantsByUser>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getCompanyStructureDescendantsByUser(payload),
    meta,
  )
);

export const getAndSetInStoreCompanyStructureDescendantsByUser = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSetCompanyStructureDescendantsByUser>> => async (dispatch) => {
  const result = await dispatch(
    getSetCompanyStructureDescendantsByUser(payload, meta),
  );

  dispatch(
    setCompanyStructureDescendantsByUser(result.data),
  );

  return result;
};

export const resetSetCompanyStructureAll = (): EtsAction<EtsActionReturnType<typeof companyStructureSetNewData>> => (dispatch) => (
  dispatch(
    companyStructureSetNewData({
      companyStructureList: [],
      companyStructureLinearList: [],
      companyStructureDescendantsByUserList: [],
    }),
  )
);
