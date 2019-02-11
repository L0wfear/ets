import { someUniqSetNewData } from 'redux-main/reducers/modules/some_uniq/common';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { promiseGetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/promise';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

/* --------------- обновление стора --------------- */
export const actionSetCleanCategories = (cleanCategoriesList: IStateSomeUniq['cleanCategoriesList']) => (dispatch) => (
  dispatch(
    someUniqSetNewData({
      cleanCategoriesList,
    }),
  )
);

/* --------------- сброс стора --------------- */
export const actionResetCleanCategories = (): ThunkAction<void, ReduxState, {}, AnyAction> => async (dispatch) => {
  dispatch(
    actionSetCleanCategories([]),
  );

  return null;
};

/* --------------- запрос --------------- */
export const actionGetCleanCategories: any = (payload = {}, { page, path }: LoadingMeta) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: promiseGetCleanCategories(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);

/* --------------- запрос и установка в стор --------------- */
export const actionGetAndSetInStoreCleanCategories: any = (payload = {}, { page, path }: LoadingMeta) => async (dispatch) => {
  const { payload: { data } } = await dispatch(
    actionGetCleanCategories(payload, { page, path }),
  );

  dispatch(
    actionSetCleanCategories(data),
  );

  return {
    cleanCategoriesList: data,
  };
};

export default {
  actionSetCleanCategories,
  actionResetCleanCategories,
  actionGetCleanCategories,
  actionGetAndSetInStoreCleanCategories,
};
