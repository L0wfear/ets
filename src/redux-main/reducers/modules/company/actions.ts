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
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { HandleThunkActionCreator } from 'react-redux';

export const actionSetCompany = (
  companyList: IStateCompany['companyList'],
): ThunkAction<IStateCompany['companyList'], ReduxState, {}, AnyAction> => (
  dispatch,
) => {
  dispatch(
    actionCompanySetNewData({
      companyList,
    }),
  );

  return companyList;
};
export const actionResetSetCompany = (): ThunkAction<
  null,
  ReduxState,
  {},
  AnyAction
> => (dispatch) => {
  dispatch(actionSetCompany([]));

  return null;
};
export const actionGetBlobCompany = (
  payloadOwn: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseLoadPFCompany>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
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
): ThunkAction<
  ReturnType<typeof promiseGetCompany>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetCompany(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

export const actionGetAndSetInStoreCompany = (
  payload: object,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<HandleThunkActionCreator<typeof actionLoadCompany>>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const response = await dispatch(actionLoadCompany(payload, meta));

  dispatch(actionSetCompany(response.data));

  return response;
};
export const actionCreateCompany = (
  companyRaw: Partial<Company>,
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseCreateCompany>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
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
): ThunkAction<
  ReturnType<typeof promiseUpdateCompany>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
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
): ThunkAction<
  ReturnType<typeof promiseDeleteCompany>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
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
