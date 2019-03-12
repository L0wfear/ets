import {
  promiseGetWaybillById,
} from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
import {
  Waybill,
} from 'redux-main/reducers/modules/waybill/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';

const actionGetWaybillById = (
  id: Waybill['id'],
  meta: LoadingMeta,
): ThunkAction<
  ReturnType<typeof promiseGetWaybillById>,
  ReduxState,
  {},
  AnyAction
> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseGetWaybillById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const waybillActions = {
  actionGetWaybillById,
};

export default waybillActions;
