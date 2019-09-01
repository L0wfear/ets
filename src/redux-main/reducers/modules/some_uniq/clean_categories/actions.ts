import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

/* --------------- обновление стора --------------- */
export const actionSetCleanCategories = (
  cleanCategoriesList: IStateSomeUniq['cleanCategoriesList'],
) => (dispatch) =>
  dispatch(
    someUniqSetNewData({
      cleanCategoriesList,
    }),
  );

/* --------------- сброс стора --------------- */
export const actionResetCleanCategories = (): EtsAction<void> => async (dispatch) => {
  dispatch(actionSetCleanCategories([]));

  return null;
};

/* --------------- запрос --------------- */
export const actionGetCleanCategories = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseGetCleanCategories>> => async (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseGetCleanCategories(payload),
    meta,
  );
};
/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreCleanCategories = (payload = {}, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof actionGetCleanCategories>> => async (dispatch) => {
  const result = await dispatch(actionGetCleanCategories(payload, meta));

  dispatch(actionSetCleanCategories(result.data));

  return result;
};
