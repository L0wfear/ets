import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetCarsTravelTime } from 'redux-main/reducers/modules/some_uniq/cars_travel_time/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

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
export const actionResetCarsTravelTime = (): EtsAction<void> => async (dispatch) => {
  dispatch(actionSetCarsTravelTime([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetCarsTravelTime = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetCarsTravelTime>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetCarsTravelTime(payload),
    meta,
  );
};

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreCarsTravelTime = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetCarsTravelTime>> => async (dispatch) => {
  const result = await dispatch(actionGetCarsTravelTime(payload, meta));

  dispatch(actionSetCarsTravelTime(result.data));

  return result;
};

export default {
  actionSetCarsTravelTime,
  actionResetCarsTravelTime,
  actionGetCarsTravelTime,
  actionGetAndSetInStoreCarsTravelTime,
};
