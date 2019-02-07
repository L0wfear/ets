import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSparePart,
  createSetSparePart,
  updateSetSparePart,
  autobaseDeleteSparePart,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/promise';

/* ---------- SparePart ---------- */
export const autobaseSetSparePart = (sparePartList: SparePart[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      sparePartList,
    }),
  )
);
export const autobaseResetSetSparePart = () => (dispatch) => (
  dispatch(
    autobaseSetSparePart([]),
  )
);
export const autobaseGetSetSparePart = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSparePart(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const sparePartGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetSparePart(payload, { page, path }),
  );

  dispatch(
    autobaseSetSparePart(data),
  );

  return {
    sparePartList: data,
  };
};
export const autobaseCreateSparePart: any = (sparePartOld: SparePart, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: sparePart } = await dispatch({
    type: 'none',
    payload: createSetSparePart(sparePartOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return sparePart;
};
export const autobaseUpdateSparePart: any = (sparePartOld: SparePart, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: sparePart } = await dispatch({
    type: 'none',
    payload: updateSetSparePart(sparePartOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return sparePart;
};
export const autobaseRemoveSparePart = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteSparePart(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
