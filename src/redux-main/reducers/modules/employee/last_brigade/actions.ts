import {
  promiseLoadLastBrigade,
} from 'redux-main/reducers/modules/employee/last_brigade/promise';
import { LastBrigade } from 'redux-main/reducers/modules/employee/last_brigade/@types';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionLoadLastBrigade = (payload: { id: number }, { page, path }: LoadingMeta): ThunkAction<Promise<LastBrigade>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload: response } = await dispatch({
    type: 'none',
    payload: promiseLoadLastBrigade(payload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return response;
};
