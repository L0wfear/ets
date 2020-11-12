import { RefillService, RefillPrintService } from 'api/Services';
import { makeDate } from 'components/@next/@utils/dates/dates';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import { Refill } from './@types';

export const promiseGetRefillList = async (payload) => {
  let response = null;
  try {
    response = await RefillService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<Refill> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};

export const promiseGetBlobRefill = async (payloadOwn: { date_start: string; date_end: string; }, filter: OneRegistryData['list']['processed']['filterValues']) => {
  let response = null;
  const payload: any = {
    ...payloadOwn,
    format: 'xls'
  };
  if (filter) {
    payload.filter = JSON.stringify(filter);
  }

  try {
    response = await RefillPrintService.getBlob(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let fileName = 'Реестр заправок по состоянию на';
  fileName = `${fileName} ${makeDate(payload.date_start)}.xls`;

  return {
    blob: get(response, 'blob', null),
    fileName,
  };
};