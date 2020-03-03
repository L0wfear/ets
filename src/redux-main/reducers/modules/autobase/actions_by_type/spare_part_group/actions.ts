import { SparePartGroup } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getSparePartGroup,
} from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

/* ---------- SparePartGroup ---------- */
export const autobaseSetSparePartGroup = (sparePartGroupList: Array<SparePartGroup>): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      sparePartGroupList,
    }),
  )
);
export const autobaseResetSetSparePartGroup = (): EtsAction<EtsActionReturnType<typeof autobaseSetSparePartGroup>> => (dispatch) => (
  dispatch(
    autobaseSetSparePartGroup([]),
  )
);
export const autobaseGetSparePartGroup = (payload: Parameters<typeof getSparePartGroup>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getSparePartGroup>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getSparePartGroup(payload),
    meta,
  )
);
export const sparePartGroupGetAndSetInStore = (...arg: Parameters<typeof autobaseGetSparePartGroup>): EtsAction<EtsActionReturnType<typeof autobaseGetSparePartGroup>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetSparePartGroup(...arg),
  );

  dispatch(
    autobaseSetSparePartGroup(result.data),
  );

  return result;
};
