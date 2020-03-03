import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  createSetEngineType,
  updateSetEngineType,
  autobaseDeleteEngineType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/engine_type/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- EngineType ---------- */
export const autobaseSetEngineType = (engineTypeList: Array<EngineType>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      engineTypeList,
    }),
  )
);
export const autobaseResetSetEngineType = (): EtsAction<EtsActionReturnType<typeof autobaseSetEngineType>> => (dispatch) => (
  dispatch(
    autobaseSetEngineType([]),
  )
);
export const autobaseCreateEngineType = (engineTypeOld: EngineType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetEngineType>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetEngineType(engineTypeOld),
    meta,
  );
};
export const autobaseUpdateEngineType = (engineTypeOld: EngineType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetEngineType>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetEngineType(engineTypeOld),
    meta,
  );
};

export const autobaseRemoveEngineType = (id: EngineType['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteEngineType>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteEngineType(id),
    meta,
  );
};
