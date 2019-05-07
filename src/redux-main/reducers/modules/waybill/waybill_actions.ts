import {
  promiseGetWaybillById, promiseGetBlobWaybilljournalReport, promiseGetBlobWaybillReport,
} from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
import {
  Waybill,
} from 'redux-main/reducers/modules/waybill/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

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

const actionGetBlobWaybillJournalReport = (payload: { date: string } | { month: number, year: number }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): ThunkAction<Promise<any>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobWaybilljournalReport(payload, filter),
    meta,
  );

  return result;
};

const actionGetBlobWaybillReport = (payload: { date_start: string, date_end: string }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): ThunkAction<Promise<any>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobWaybillReport(payload, filter),
    meta,
  );

  return result;
};

const waybillActions = {
  actionGetWaybillById,
  actionGetBlobWaybillJournalReport,
  actionGetBlobWaybillReport,
};

export default waybillActions;
