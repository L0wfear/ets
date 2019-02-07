import { TechMaintType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTechMaintType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_type/promise';

/* ---------- TechMaintType ---------- */
export const autobaseSetTechMaintType = (techMaintTypeList: TechMaintType[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintTypeList,
    }),
  )
);
export const autobaseResetSetTechMaintType = () => (dispatch) => (
  dispatch(
    autobaseSetTechMaintType([]),
  )
);
export const autobaseGetTechMaintType: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getTechMaintType(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const techMaintTypeGetAndSetInStore: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetTechMaintType(payload, { page, path }),
  );

  dispatch(
    autobaseSetTechMaintType(data),
  );

  return {
    techMaintTypeList: data,
  };
};
