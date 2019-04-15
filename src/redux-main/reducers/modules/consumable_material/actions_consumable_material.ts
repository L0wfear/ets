import { ConsumableMaterial } from "./@types/consumableMaterial";
import { LoadingMeta } from "redux-main/_middleware/@types/ets_loading.h";
import { ThunkAction } from "redux-thunk";
import etsLoadingCounter from "redux-main/_middleware/ets-loading/etsLoadingCounter";
import { ReduxState } from "redux-main/@types/state";
import { AnyAction } from "redux";
import { promiseCreateConsumableMaterial, promiseUpdateConsumableMaterial } from "./promise_consumable_material";

export const actionCreateConsumableMaterial = (consumableMaterialNew: ConsumableMaterial, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateConsumableMaterial>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateConsumableMaterial(consumableMaterialNew),
    meta,
  );

  return response;
};

export const actionUpdateConsumableMaterial = (consumableMaterialNew: ConsumableMaterial, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateConsumableMaterial>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateConsumableMaterial(consumableMaterialNew),
    meta,
  );

  return response;
};
