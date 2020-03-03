import { actionCompanySetNewData } from 'redux-main/reducers/modules/company/common';

import {
  promiseGetCompany,
  promiseLoadPFCompany,
  promiseCreateCompany,
  promiseUpdateCompany,
  promiseDeleteCompany,
} from 'redux-main/reducers/modules/company/promises';
import {
  IStateCompany,
  Company,
} from 'redux-main/reducers/modules/company/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionSetCompany = (
  companyList: IStateCompany['companyList'],
): EtsAction<IStateCompany['companyList']> => (
  dispatch,
) => {
  dispatch(
    actionCompanySetNewData({
      companyList,
    }),
  );

  return companyList;
};
export const actionResetSetCompany = (): EtsAction<null> => (dispatch) => {
  dispatch(actionSetCompany([]));

  return null;
};
export const actionGetBlobCompany = (
  payloadOwn: object,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseLoadPFCompany>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFCompany(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const actionLoadCompany = (
  payloadOwn: object,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseGetCompany>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetCompany(payloadOwn),
    meta,
  );
};

export const actionGetAndSetInStoreCompany = (
  payload: object,
  meta: LoadingMeta,
): EtsAction<EtsActionReturnType<typeof actionLoadCompany>> => async (dispatch) => {
  const response = await dispatch(actionLoadCompany(payload, meta));

  dispatch(actionSetCompany(response.data));

  return response;
};
export const actionCreateCompany = (
  companyRaw: Partial<Company>,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseCreateCompany>> => async (dispatch) => {
  const { payload: company } = await dispatch({
    type: 'none',
    payload: promiseCreateCompany(companyRaw),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return company;
};
export const actionUpdateCompany = (
  companyOld: Company,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseUpdateCompany>> => async (dispatch) => {
  const { payload: company } = await dispatch({
    type: 'none',
    payload: promiseUpdateCompany(companyOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return company;
};
export const actionRemoveCompany = (
  compnay_id: number,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseDeleteCompany>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseDeleteCompany(compnay_id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const companyActions = {
  actionCompanySetNewData,
  actionSetCompany,
  actionGetBlobCompany,
  actionResetSetCompany,
  actionLoadCompany,
  actionGetAndSetInStoreCompany,
  actionCreateCompany,
  actionUpdateCompany,
  actionRemoveCompany,
};

export default companyActions;
