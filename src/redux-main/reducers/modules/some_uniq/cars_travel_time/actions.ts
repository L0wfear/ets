import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetCarsTravelTime } from 'redux-main/reducers/modules/some_uniq/cars_travel_time/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

/* --------------- обновление стора --------------- */
export const actionSetCarsTravelTime = (
  carsTravelTimeList: IStateSomeUniq['carsTravelTimeList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      carsTravelTimeList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetCarsTravelTime = (): ThunkAction<
  void,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  dispatch(actionSetCarsTravelTime([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetCarsTravelTime: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetCarsTravelTime(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreCarsTravelTime: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetCarsTravelTime(payload, { page, path }));

  dispatch(actionSetCarsTravelTime(data));

  return {
    carsTravelTimeList: data,
  };
};

export default {
  actionSetCarsTravelTime,
  actionResetCarsTravelTime,
  actionGetCarsTravelTime,
  actionGetAndSetInStoreCarsTravelTime,
};
