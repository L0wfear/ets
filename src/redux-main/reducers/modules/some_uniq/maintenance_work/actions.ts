import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetMaintenanceWork = (maintenanceWorkList: IStateSomeUniq['maintenanceWorkList']): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      maintenanceWorkList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetMaintenanceWork = (): EtsAction<EtsActionReturnType<typeof actionSetMaintenanceWork>> => (dispatch) => {
  dispatch(actionSetMaintenanceWork([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetMaintenanceWork = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetMaintenanceWork>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetMaintenanceWork(payload),
    meta,
  );
};
/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreMaintenanceWork = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetMaintenanceWork>> => async (dispatch) => {
  const result = await dispatch(actionGetMaintenanceWork(payload, meta));

  dispatch(actionSetMaintenanceWork(result.data));

  return result;
};
