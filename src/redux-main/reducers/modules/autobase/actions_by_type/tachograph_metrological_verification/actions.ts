import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { TachographMetrologicalVerificationList, TachographMetrologicalVerification } from './@types';
import {
  promiseGetTachographMetrologicalVerificationList,
  createSetTachographMetrologicalVerification,
  updateSetTachographMetrologicalVerification,
  autobaseDeleteTachographMetrologicalVerification
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographMetrologicalVerificationList = (tachographMetrologicalVerificationList: Array<TachographMetrologicalVerificationList>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tachographMetrologicalVerificationList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetTachographMetrologicalVerificationList = (): EtsAction<EtsActionReturnType<typeof actionSetTachographMetrologicalVerificationList>> => (dispatch) => (
  dispatch(
    actionSetTachographMetrologicalVerificationList([]),
  )
);

/* --------------- запрос --------------- */
export const actionGetTachographMetrologicalVerificationList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetTachographMetrologicalVerificationList>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetTachographMetrologicalVerificationList(payload),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographMetrologicalVerificationList = (payload: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetTachographMetrologicalVerificationList>> => async (dispatch) => {
  const result = await dispatch(
    actionGetTachographMetrologicalVerificationList(payload, meta),
  );

  dispatch(
    actionSetTachographMetrologicalVerificationList(result.data),
  );

  return result;
};

export const autobaseCreateTachographMetrologicalVerification = (tachographMetrologicalVerificationOld: TachographMetrologicalVerification, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTachographMetrologicalVerification>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTachographMetrologicalVerification(tachographMetrologicalVerificationOld),
    meta,
  );
};

export const autobaseUpdateTachographMetrologicalVerification = (tachographMetrologicalVerificationOld: TachographMetrologicalVerification, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTachographMetrologicalVerification>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTachographMetrologicalVerification(tachographMetrologicalVerificationOld),
    meta,
  );
};
export const autobaseRemoveTachographMetrologicalVerification = (id: TachographMetrologicalVerification['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTachographMetrologicalVerification>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTachographMetrologicalVerification(id),
    meta,
  );
};
