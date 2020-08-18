import {
  promiseGetWaybillById, promiseGetBlobWaybilljournalReport, promiseGetBlobWaybillReport, promiseGetLastClosedWaybill, promiseGetLatestWaybillDriver, promisePrintWaybill, promiseUpdateWaybill, promiseCreateWaybill, promiseGetMissionsByCarAndDates,
} from 'redux-main/reducers/modules/waybill/promises/waybill_promises';
import {
  Waybill,
} from 'redux-main/reducers/modules/waybill/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionFetchWithCount } from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

export const actionGetWaybillById = (
  id: Waybill['id'],
  meta: LoadingMeta,
): EtsAction<Promise<any>> => async (dispatch)  => {
  const payload = await dispatch(actionFetchWithCount(promiseGetWaybillById(id), {...meta}));
  return payload;
};

export const actionGetBlobWaybillJournalReport = (payload: { date: string; } | { month: number; year: number; }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): EtsAction<Promise<any>> => async (dispatch) => {
  const result = await etsLoadingCounter(
    dispatch,
    promiseGetBlobWaybilljournalReport(payload, filter),
    meta,
  );

  return result;
};

export const actionGetBlobWaybillReport = (payload: { date_start: string; date_end: string; }, filter: OneRegistryData['list']['processed']['filterValues'], meta: LoadingMeta): EtsAction<Promise<any>> => async (dispatch) => {
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

export const actionGetLatestWaybillDriver = (payload: Parameters<typeof promiseGetLatestWaybillDriver>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetLatestWaybillDriver>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetLatestWaybillDriver(payload),
    meta,
  )
);

export const actionPrintWaybill = (payload: Parameters<typeof promisePrintWaybill>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promisePrintWaybill>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promisePrintWaybill(payload),
    meta,
  )
);

export const actionCreateWaybill = (payload: Parameters<typeof promiseCreateWaybill>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseCreateWaybill>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseCreateWaybill(payload),
    {
      ...meta,
      noTimeout: true,
    },
  )
);

export const actionUpdateWaybill = (payload: Parameters<typeof promiseUpdateWaybill>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseUpdateWaybill>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseUpdateWaybill(payload),
    {
      ...meta,
      noTimeout: true,
    },
  )
);

export const actionGetMissionsByCarAndDates = (payload: Parameters<typeof promiseGetMissionsByCarAndDates>[0], meta: LoadingMeta): EtsAction<ReturnType<typeof promiseGetMissionsByCarAndDates>> => (dispatch) => (
  etsLoadingCounter(
    dispatch,
    promiseGetMissionsByCarAndDates(payload),
    meta,
  )
);
