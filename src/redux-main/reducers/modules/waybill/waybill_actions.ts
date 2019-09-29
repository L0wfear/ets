import {
  promiseGetWaybillById, promiseGetBlobWaybilljournalReport, promiseGetBlobWaybillReport, promiseGetLastClosedWaybill,
} from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
import {
  Waybill,
} from 'redux-main/reducers/modules/waybill/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

export const actionGetWaybillById = (
  id: Waybill['id'],
  meta: LoadingMeta,
): EtsAction<
  ReturnType<typeof promiseGetWaybillById>,
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

export const actionGetBlobWaybillJournalReport = (payload: { date: string } | { month: number, year: number }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): EtsAction<Promise<any>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobWaybilljournalReport(payload, filter),
    meta,
  );

  return result;
};

export const actionGetBlobWaybillReport = (payload: { date_start: string, date_end: string }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): EtsAction<Promise<any>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobWaybillReport(payload, filter),
    meta,
  );

  return result;
};

export const actionGetLastClosedWaybill = (payload: Parameters<typeof promiseGetLastClosedWaybill>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetLastClosedWaybill>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetLastClosedWaybill(payload),
    meta,
  )
);
