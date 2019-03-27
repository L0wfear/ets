import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { HandleThunkActionCreator } from 'react-redux';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { ThunkAction } from 'redux-thunk';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
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

const actionLoadEdcRequestById = (id: number, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseLoadEdcRequestById>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseLoadEdcRequestById(
      id,
    ),
    meta,
  );
};

const actionRejectEdcRequest = (edcRequestReject: EdcRequestReject, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseLoadEdcRequestById>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseRejectEdcRequest(
      edcRequestReject,
    ),
    meta,
  );
};

const actionCancelEdcRequest = (edcRequestCancel: EdcRequestCancel, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseLoadEdcRequestById>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCancelEdcRequest(
      edcRequestCancel,
    ),
    meta,
  );
};

const actionCloseEdcRequestById = (id: number, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof promiseLoadEdcRequestById>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    promiseCloseEdcRequestById(
      id,
    ),
    meta,
  );
};

const actionLoadRefusalReason = (meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof loadRefusalReason>>, ReduxState, {}, AnyAction> => (dispatch) => {
  return etsLoadingCounter(
    dispatch,
    loadRefusalReason(),
    meta,
  );
};

const actionLoadRejectionReason = (meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof loadRejectionReason>>, ReduxState, {}, AnyAction> => (dispatch) => {
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
