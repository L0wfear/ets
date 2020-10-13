import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import { Tachograph } from './@types';
import {
  promiseGetTachographPeriodicVerificationList,
  promiseCreateTachographPeriodicVerification,
  promiseUpdateTachographPeriodicVerification,
  promiseDeleteTachographPeriodicVerification,
  promiseGetTachographsList,
  promiseGetTachographVerificationReasonList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/promise';
import {
  EtsAction,
  EtsActionReturnType,
} from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetTachographPeriodicVerificationList = (
  tachographPeriodicVerificationList: Array<Tachograph>
): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) =>
  dispatch(
    autobaseSetNewData({
      tachographPeriodicVerificationList,
    })
  );

/* --------------- сброс стора --------------- */
export const actionResetTachographPeriodicVerificationList = (): EtsAction<
  EtsActionReturnType<typeof actionSetTachographPeriodicVerificationList>
> => (dispatch) => dispatch(actionSetTachographPeriodicVerificationList([]));

/* --------------- запрос --------------- */
export const actionGetTachographPeriodicVerificationList = (
  payload: object,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseGetTachographPeriodicVerificationList>> => async (
  dispatch
) => etsLoadingCounter(dispatch, promiseGetTachographPeriodicVerificationList(payload), meta);

export const actionCreateTachographPeriodicVerification = (
  payload: Tachograph,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseCreateTachographPeriodicVerification>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseCreateTachographPeriodicVerification(payload), meta);
};

export const actionUpdateTachographPeriodicVerification = (
  payload: Tachograph,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseUpdateTachographPeriodicVerification>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseUpdateTachographPeriodicVerification(payload), meta);
};

export const actionDeleteTachographPeriodicVerification = (
  id: number,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseDeleteTachographPeriodicVerification>> => async (
  dispatch
) => {
  return etsLoadingCounter(dispatch, promiseDeleteTachographPeriodicVerification(id), meta);
};

export const actionGetTachographsList = (
  payload: object,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseGetTachographsList>> => async (
  dispatch
) => etsLoadingCounter(dispatch, promiseGetTachographsList(payload), meta);

export const actionGetTachographVerificationReasonList = (
  payload: object,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof promiseGetTachographVerificationReasonList>> => async (
  dispatch
) => etsLoadingCounter(dispatch, promiseGetTachographVerificationReasonList(payload), meta);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreTachographPeriodicVerificationList = (
  payload: object,
  meta: LoadingMeta
): EtsAction<EtsActionReturnType<typeof actionGetTachographPeriodicVerificationList>> => async (
  dispatch
) => {
  const result = await dispatch(actionGetTachographPeriodicVerificationList(payload, meta));

  dispatch(actionSetTachographPeriodicVerificationList(result.data));

  return result;
};
