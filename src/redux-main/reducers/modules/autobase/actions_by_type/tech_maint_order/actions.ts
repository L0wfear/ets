import { TechMaintOrder } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSetTechMaintOrder,
  createSetTechMaintOrder,
  updateSetTechMaintOrder,
  autobaseDeleteTechMaintOrder,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_order/promise';

/* ---------- TechMaintOrder ---------- */
export const autobaseSetTechMaintOrder = (techMaintOrderList: TechMaintOrder[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintOrderList,
    }),
  )
);
export const autobaseResetSetTechMaintOrder = () => (dispatch) => (
  dispatch(
    autobaseSetTechMaintOrder([]),
  )
);
export const autobaseGetSetTechMaintOrder = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSetTechMaintOrder(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const techMaintOrderGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSetTechMaintOrder(payload, { page, path }),
  );

  dispatch(
    autobaseSetTechMaintOrder(data),
  );

  return {
    techMaintOrderList: data,
  };
};
export const autobaseCreateTechMaintOrder: any = (techMaintOrderOld: TechMaintOrder, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { techMaintOrder } } = await dispatch({
    type: 'none',
    payload: createSetTechMaintOrder(techMaintOrderOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techMaintOrder;
};
export const autobaseUpdateTechMaintOrder: any = (techMaintOrderOld: TechMaintOrder, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { techMaintOrder } } = await dispatch({
    type: 'none',
    payload: updateSetTechMaintOrder(techMaintOrderOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return techMaintOrder;
};
export const autobaseRemoveTechMaintOrder = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: autobaseDeleteTechMaintOrder(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
