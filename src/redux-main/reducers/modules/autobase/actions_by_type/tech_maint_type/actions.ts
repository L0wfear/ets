import { TechMaintType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import {
  getTechMaintType,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_type/promise';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* ---------- TechMaintType ---------- */
export const autobaseSetTechMaintType = (techMaintTypeList: TechMaintType[]): EtsAction<EtsActionReturnType<typeof autobaseSetNewData>> => (dispatch) => (
  dispatch(
    autobaseSetNewData({
      techMaintTypeList,
    }),
  )
);
export const autobaseResetSetTechMaintType = (): EtsAction<EtsActionReturnType<typeof autobaseSetTechMaintType>> => (dispatch) => (
  dispatch(
    autobaseSetTechMaintType([]),
  )
);
export const autobaseGetTechMaintType = (payload: Parameters<typeof getTechMaintType>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof getTechMaintType>> => async (dispatch) => (
  etsLoadingCounter(
    dispatch,
    getTechMaintType(payload),
    meta,
  )
);
export const techMaintTypeGetAndSetInStore = (...arg: Parameters<typeof autobaseGetTechMaintType>): EtsAction<EtsActionReturnType<typeof autobaseGetTechMaintType>> => async (dispatch) => {
  const result = await dispatch(
    autobaseGetTechMaintType(...arg),
  );

  dispatch(
    autobaseSetTechMaintType(result.data),
  );

  return result;
};
