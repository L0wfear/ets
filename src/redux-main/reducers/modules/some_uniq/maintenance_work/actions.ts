import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetMaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

/* --------------- обновление стора --------------- */
export const actionSetMaintenanceWork = (
  maintenanceWorkList: IStateSomeUniq['maintenanceWorkList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      maintenanceWorkList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetMaintenanceWork = (): EtsAction<void> => async (dispatch) => {
  dispatch(actionSetMaintenanceWork([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetMaintenanceWork: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) =>
  dispatch({
    type: 'none',
    payload: promiseGetMaintenanceWork(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreMaintenanceWork: any = (
  payload = {},
  { page, path }: LoadingMeta,
) => async (dispatch) => {
  const {
    payload: { data },
  } = await dispatch(actionGetMaintenanceWork(payload, { page, path }));

  dispatch(actionSetMaintenanceWork(data));

  return {
    maintenanceWorkList: data,
  };
};

export default {
  actionSetMaintenanceWork,
  actionResetMaintenanceWork,
  actionGetMaintenanceWork,
  actionGetAndSetInStoreMaintenanceWork,
};
