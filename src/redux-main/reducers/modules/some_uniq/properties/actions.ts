import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetCleaningRatePropertie } from 'redux-main/reducers/modules/some_uniq/properties/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetCleaningRatePropertie = (cleaningRatePropertieList: IStateSomeUniq['cleaningRatePropertieList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      cleaningRatePropertieList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetCleaningRatePropertie = (): EtsAction<void> => async (dispatch) => {
  dispatch(
    actionSetCleaningRatePropertie([]),
  );

  return null;
};

/* --------------- запрос --------------- */
export const actionGetCleaningRatePropertie = (type, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCleaningRatePropertie>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetCleaningRatePropertie(type),
    meta,
  )
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreCleaningRatePropertie = (type, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetCleaningRatePropertie>> => async (dispatch) => {
  const result = await dispatch(
    actionGetCleaningRatePropertie(type, meta),
  );

  dispatch(
    actionSetCleaningRatePropertie(result.data),
  );

  return result;
};

export default {
  actionSetCleaningRatePropertie,
  actionResetCleaningRatePropertie,
  actionGetCleaningRatePropertie,
  actionGetAndSetInStoreCleaningRatePropertie,
};
