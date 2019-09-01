import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSparePart,
  createSetSparePart,
  updateSetSparePart,
  autobaseDeleteSparePart,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/promise';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- SparePart ---------- */
export const autobaseSetSparePart = (sparePartList: SparePart[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      sparePartList,
    }),
  )
);
export const autobaseResetSetSparePart = (): EtsAction<EtsActionReturnType<typeof autobaseSetSparePart>> => (dispatch) => (
  dispatch(
    autobaseSetSparePart([]),
  )
);
export const autobaseGetSetSparePart = (payloadOwn = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSparePart>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    getSparePart(payloadOwn),
    meta,
  );
};
export const sparePartGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSparePart>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetSparePart(payload, meta),
  );

  dispatch(
    autobaseSetSparePart(result.data),
  );

  return result;
};
export const autobaseCreateSparePart = (sparePartOld: SparePart, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof createSetSparePart>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    createSetSparePart(sparePartOld),
    meta,
  );
};
export const autobaseUpdateSparePart = (sparePartOld: SparePart, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof updateSetSparePart>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    updateSetSparePart(sparePartOld),
    meta,
  );
};
export const autobaseRemoveSparePart = (id: SparePart['id'], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseDeleteSparePart>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    autobaseDeleteSparePart(id),
    meta,
  );
};
