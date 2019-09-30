import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { promiseLoadConsumableMaterialCountMission } from './promise';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsActionReturnType, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';

export const actionSetConsumableMaterialCountMission = (consumableMaterialCountMissionList: ConsumableMaterialCountMission[]): EtsAction<EtsActionReturnType<typeof someUniqSetNewData>> => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      consumableMaterialCountMissionList,
    }),
  )
);
export const actionResetSetConsumableMaterialCountMission = (): EtsAction<EtsActionReturnType<typeof actionSetConsumableMaterialCountMission>> => (dispatch) => (
  dispatch(
    actionSetConsumableMaterialCountMission([]),
  )
);
export const actionLoadConsumableMaterialCountMission = (payload: Parameters<typeof promiseLoadConsumableMaterialCountMission>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadConsumableMaterialCountMission>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadConsumableMaterialCountMission(payload),
    meta,
  );
};

export const actionConsumableMaterialCountMissionGetAndSetInStore = (payload: Parameters<typeof actionLoadConsumableMaterialCountMission>[0], meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionLoadConsumableMaterialCountMission>> => async (dispatch) => {
  const result = await dispatch(
    actionLoadConsumableMaterialCountMission(payload, meta),
  );

  dispatch(
    actionSetConsumableMaterialCountMission(result.data),
  );

  return result;
};
