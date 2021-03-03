import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetUsersAccess, promiseCreateUserAccess, promiseUpdtateUserAccess } from 'redux-main/reducers/modules/some_uniq/users_access/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import {
  User,
  CreateUserAccessPayload,
  GetUserAccessPayload,
  UpdtateUserAccessPayload
} from 'redux-main/reducers/modules/some_uniq/users_access/@types';

/* --------------- обновление стора --------------- */
export const actionSetUsersAccessList = (usersAccessList: IStateSomeUniq['usersAccessList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      usersAccessList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetUsersAccessList = (): EtsAction<EtsActionReturnType<typeof actionSetUsersAccessList>> => (dispatch) => (
  dispatch(
    actionSetUsersAccessList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetUsersAccessList = (payload: GetUserAccessPayload, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetUsersAccess>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetUsersAccess(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreUsersAccessList = (payload: GetUserAccessPayload, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetUsersAccessList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetUsersAccessList(payload, meta),
  );

  dispatch(
    actionSetUsersAccessList(result),
  );

  return result;
};

export const actionCreateUsersAccess = (
  user: User,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseCreateUserAccess>> => async (dispatch) => {
  const usersAccesRow: CreateUserAccessPayload = {
    for: user.for,
    user_id: user.user_id,
    access_companies: user.access_companies,
    access_okrugs: user.access_okrugs,
  };
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateUserAccess(usersAccesRow),
    meta: {
      promise: true,
      ...meta,
    },
  });
  
  return payload;
};
  
export const actionUpdateUsersAccess = (
  user: User,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseUpdtateUserAccess>> => async (dispatch) => {
  const {
    access_companies,
    access_okrugs,
  }: UpdtateUserAccessPayload = user;
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdtateUserAccess(user.id, {access_companies, access_okrugs}),
    meta: {
      promise: true,
      ...meta,
    },
  });
  
  return payload;
};
