import { PropulsionType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getPropulsionType,
  createSetPropulsionType,
  updateSetPropulsionType,
  autobaseDeletePropulsionType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/propulsion_type/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- PropulsionType ---------- */
export const autobaseSetPropulsionType = (propulsionTypeList: Array<PropulsionType>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      propulsionTypeList,
    }),
  )
);
export const autobaseResetSetPropulsionType = (): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetPropulsionType([]),
  )
);
export const autobaseGetSetPropulsionType = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getPropulsionType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getPropulsionType(payloadOwn),
    meta,
  );
};
export const propulsionTypeGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetPropulsionType>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetPropulsionType(payload, meta),
  );

  dispatch(
    autobaseSetPropulsionType(result.data),
  );

  return result;
};
export const autobaseCreatePropulsionType = (propulsionTypeOld: PropulsionType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetPropulsionType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetPropulsionType(propulsionTypeOld),
    meta,
  );
};
export const autobaseUpdatePropulsionType = (propulsionTypeOld: PropulsionType, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetPropulsionType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetPropulsionType(propulsionTypeOld),
    meta,
  );
};
export const autobaseRemovePropulsionType = (id: PropulsionType['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeletePropulsionType>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeletePropulsionType(id),
    meta,
  );
};
