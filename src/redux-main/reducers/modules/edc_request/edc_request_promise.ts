import { EdcRequestService, EdcRequestChangeStatusService, EdcRefusalReasonService, EdcRejectionReasonService } from "api/Services";
import { get } from 'lodash';
import { EdcRequest } from "./@types";
import { EdcRequestCancel } from "components/new/pages/edc_request/form/cancel/@types/EdcRequestCancel";
import { EdcRequestReject } from "components/new/pages/edc_request/form/reject/@types/EdcRequestReject";

export const promiseLoadEdcRequestById = async (id: number) => {
  let response = null;

  try {
    response = await EdcRequestService.get(
      { id },
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const edc_request: EdcRequest = get(response, 'result.0', null);

  return edc_request;
};

export const promiseRejectEdcRequest = async (edc_request_reject: EdcRequestReject) => {
  const { id, ...payload } = edc_request_reject;
  const response  = await EdcRequestChangeStatusService.path(id).path('reject').put(
    payload,
    false,
    'json',
  );

  return response;
};

export const promiseCancelEdcRequest = async (edc_request_cancel: EdcRequestCancel) => {
  const { id, ...payload } = edc_request_cancel;
  const response  = await EdcRequestChangeStatusService.path(id).path('cancel').put(
    payload,
    false,
    'json',
  );

  return response;
};

export const promiseCloseEdcRequestById = async (id: number) => {
  const response  = await EdcRequestChangeStatusService.path(id).path('close').put(
    {},
    false,
    'json',
  );

  return response;
};

export const loadRefusalReason = async () => {
  let response = null;
  try {
    response  = await EdcRefusalReasonService.get();
  } catch (error) {
    console.error(error); //tslint:disable-line
  }

  const refusalReasonList: any[] = get(response, 'result.rows', []);
  return refusalReasonList;
};

export const loadRejectionReason = async () => {
  let response = null;
  try {
    response  = await EdcRejectionReasonService.get();
  } catch (error) {
    console.error(error); //tslint:disable-line
  }

  const refusalReasonList: any[] = get(response, 'result.rows', []);
  return refusalReasonList;
};
