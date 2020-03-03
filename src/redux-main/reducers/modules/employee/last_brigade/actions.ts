import {
  promiseLoadLastBrigade,
} from 'redux-main/reducers/modules/employee/last_brigade/promise';
import { LastBrigade } from 'redux-main/reducers/modules/employee/last_brigade/@types';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export const actionLoadLastBrigade = (payload: { id: number; }, { page, path }: LoadingMeta): EtsAction<Promise<LastBrigade>> => async (dispatch) => {
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
