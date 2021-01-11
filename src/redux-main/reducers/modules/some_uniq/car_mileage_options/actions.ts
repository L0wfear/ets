import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMileageOptions } from 'redux-main/reducers/modules/some_uniq/car_mileage_options/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetMileageOptions = (mileageTypesList: IStateSomeUniq['mileageTypesList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      mileageTypesList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetMileageOptions = (): EtsAction<EtsActionReturnType<typeof actionSetMileageOptions>> => (dispatch) => {
  dispatch(actionSetMileageOptions([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetMileageOptions = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetMileageOptions>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetMileageOptions(payload),
    meta,
  );
};
/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreMileageOptions = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetMileageOptions>> => async (dispatch) => {
  const result = await dispatch(actionGetMileageOptions(payload, meta));

  dispatch(actionSetMileageOptions(result.data));

  return result;
};
