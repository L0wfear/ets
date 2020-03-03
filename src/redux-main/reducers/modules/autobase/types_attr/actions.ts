import { TypesAttr } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  promiseLoadTypesAttr,
  promiseLoadPFTypesAttr,
  promiseCreateTypesAttr,
  promiseUpdateTypesAttr,
} from 'redux-main/reducers/modules/autobase/types_attr/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TypesAttr ---------- */
export const autobaseSetTypesAttr = (typesAttrList: Array<TypesAttr>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      typesAttrList,
    }),
  )
);
export const autobaseResetSetTypesAttr = (): EtsAction<EtsActionReturnType<typeof autobaseSetTypesAttr>> => (dispatch) => (
  dispatch(
    autobaseSetTypesAttr([]),
  )
);
export const autobaseGetBlobTypesAttr = (payloadOwn: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadPFTypesAttr>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadPFTypesAttr(payloadOwn),
    meta,
  );
};
export const autobaseGetSetTypesAttr = (payloadOwn: object, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadTypesAttr>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadTypesAttr(payloadOwn),
    meta,
  );
};

export const typesAttrGetAndSetInStore = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof autobaseGetSetTypesAttr>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSetTypesAttr(payload, meta),
  );

  dispatch(
    autobaseSetTypesAttr(result.data),
  );

  return result;
};
export const autobaseCreateTypesAttr = (typesAttrOld: TypesAttr, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseCreateTypesAttr>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCreateTypesAttr(typesAttrOld),
    meta,
  );
};
export const autobaseUpdateTypesAttr = (typesAttrOld: TypesAttr, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseUpdateTypesAttr>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseUpdateTypesAttr(typesAttrOld),
    meta,
  );
};
