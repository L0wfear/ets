import { TypesAttr } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  promiseLoadTypesAttr,
  promiseLoadPFTypesAttr,
  promiseCreateTypesAttr,
  promiseUpdateTypesAttr,
} from 'redux-main/reducers/modules/autobase/types_attr/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- TypesAttr ---------- */
export const autobaseSetTypesAttr = (typesAttrList: TypesAttr[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      typesAttrList,
    }),
  )
);
export const autobaseResetSetTypesAttr = () => (dispatch) => (
  dispatch(
    autobaseSetTypesAttr([]),
  )
);
export const autobaseGetBlobTypesAttr: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadPFTypesAttr(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const autobaseGetSetTypesAttr: any = (payloadOwn: object, meta: LoadingMeta) => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadTypesAttr(payloadOwn),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
export const typesAttrGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetTypesAttr(payload, { page, path }),
  );

  dispatch(
    autobaseSetTypesAttr(data),
  );

  return {
    data,
  };
};
export const autobaseCreateTypesAttr: any = (typesAttrOld: TypesAttr, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: typesAttr } = await dispatch({
    type: 'none',
    payload: promiseCreateTypesAttr(typesAttrOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return typesAttr;
};
export const autobaseUpdateTypesAttr: any = (typesAttrOld: TypesAttr, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: typesAttr } = await dispatch({
    type: 'none',
    payload: promiseUpdateTypesAttr(typesAttrOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return typesAttr;
};
