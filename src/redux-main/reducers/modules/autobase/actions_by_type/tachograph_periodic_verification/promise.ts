import {
  TachographPeriodicVerificationService,
  TachographVerificationReasonService,
} from 'api/Services';
import { get } from 'lodash';
import { Tachograph } from './@types';

export const promiseGetTachographPeriodicVerificationList = async (payload) => {
  let response = null;
  try {
    response = await TachographPeriodicVerificationService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<Tachograph> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const promiseCreateTachographPeriodicVerification = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographPeriodicVerificationService.post(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};

export const promiseUpdateTachographPeriodicVerification = async (ownPayload) => {
  const payload = {
    ...ownPayload,
  };

  const response = await TachographPeriodicVerificationService.path(payload.id).put(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};

export const promiseDeleteTachographPeriodicVerification = async (id: number) => {
  const payload = {
    id,
  };

  const response = await TachographPeriodicVerificationService.delete(payload, false, 'json');

  const data = get(response, 'result.rows.0', get(response, 'result.0', null));

  return data;
};

export const promiseGetTachographVerificationReasonList = async (payload) => {
  let response = null;
  try {
    response = await TachographVerificationReasonService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<any> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

