import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTireModel,
  createSetTireModel,
  updateSetTireModel,
  autobaseDeleteTireModel,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TireModel ---------- */
export const autobaseSetTireModel = (tireModelList: TireModel[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      tireModelList,
    }),
  )
);
export const autobaseResetSetTireModel = (): EtsAction<EtsActionReturnType<typeof autobaseSetTireModel>> => (dispatch) => (
  dispatch(
    autobaseSetTireModel([]),
  )
);
export const autobaseGetSetTireModel = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getTireModel>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getTireModel(payloadOwn),
    meta,
  );
};
export const tireModelGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetTireModel>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTireModel(payload, meta),
  );

  dispatch(
    autobaseSetTireModel(result.data),
  );

  return result;
};
export const autobaseCreateTireModel = (tireModelOld: TireModel, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetTireModel>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetTireModel(tireModelOld),
    meta,
  );
};
export const autobaseUpdateTireModel = (tireModelOld: TireModel, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetTireModel>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetTireModel(tireModelOld),
    meta,
  );
};
export const autobaseRemoveTireModel = (id: TireModel['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteTireModel>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteTireModel(id),
    meta,
  );
};
