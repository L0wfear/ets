import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { EtsAction, EtsActionReturnType } from 'components/@next/ets_hoc/etsUseDispatch';
import {
  promiseLoadEdcRequestById,
  promiseCloseEdcRequestById,
  loadRefusalReason,
  promiseRejectEdcRequest,
  promiseCancelEdcRequest,
  loadRejectionReason,
} from './edc_request_promise';
import { EdcRequestCancel } from 'components/new/pages/edc_request/form/cancel/@types/EdcRequestCancel';
import { EdcRequestReject } from 'components/new/pages/edc_request/form/reject/@types/EdcRequestReject';

const actionLoadEdcRequestById = (id: number, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadEdcRequestById>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadEdcRequestById(
      id,
    ),
    meta,
  );
};

const actionRejectEdcRequest = (edcRequestReject: EdcRequestReject, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadEdcRequestById>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseRejectEdcRequest(
      edcRequestReject,
    ),
    meta,
  );
};

const actionCancelEdcRequest = (edcRequestCancel: EdcRequestCancel, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadEdcRequestById>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCancelEdcRequest(
      edcRequestCancel,
    ),
    meta,
  );
};

const actionCloseEdcRequestById = (id: number, meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof promiseLoadEdcRequestById>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCloseEdcRequestById(
      id,
    ),
    meta,
  );
};

const actionLoadRefusalReason = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof loadRefusalReason>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    loadRefusalReason(),
    meta,
  );
};

const actionLoadRejectionReason = (meta: LoadingMeta): EtsAction<EtsActionReturnType<typeof loadRejectionReason>> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    loadRejectionReason(),
    meta,
  );
};

const edcRequestActions = {
  actionRejectEdcRequest,
  actionCancelEdcRequest,
  actionLoadRefusalReason,
  actionLoadRejectionReason,
  actionLoadEdcRequestById,
  actionCloseEdcRequestById,
};

export default edcRequestActions;
