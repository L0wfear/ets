import { ConsumableMaterial } from './@types/consumableMaterial';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { promiseCreateConsumableMaterial, promiseUpdateConsumableMaterial } from './promise_consumable_material';

export const actionCreateConsumableMaterial = (consumableMaterialNew: ConsumableMaterial, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateConsumableMaterial>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseCreateConsumableMaterial(consumableMaterialNew),
    meta,
  );

  return response;
};

export const actionUpdateConsumableMaterial = (consumableMaterialNew: ConsumableMaterial, meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateConsumableMaterial>> => async (dispatch) => {
  const response = await etsLoadingCounter(
    dispatch,
    promiseUpdateConsumableMaterial(consumableMaterialNew),
    meta,
  );

  return response;
};
