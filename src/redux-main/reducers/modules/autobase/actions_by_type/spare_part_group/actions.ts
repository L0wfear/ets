import { SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSparePartGroup,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/promise';

/* ---------- SparePartGroup ---------- */
export const autobaseSetSparePartGroup = (sparePartGroupList: SparePartGroup[]) => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      sparePartGroupList,
    }),
  )
);
export const autobaseResetSetSparePartGroup = () => (dispatch) => (
  dispatch(
    autobaseSetSparePartGroup([]),
  )
);
export const autobaseGetSparePartGroup: any = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: getSparePartGroup(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const sparePartGroupGetAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    autobaseGetSparePartGroup(payload, { page, path }),
  );

  dispatch(
    autobaseSetSparePartGroup(data),
  );

  return {
    sparePartGroupList: data,
  };
};
