import { RefillService, RefillPrintService } from 'api/Services';
import { makeDate } from 'components/@next/@utils/dates/dates';
import { RefillReportForm } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/refill/print_form/refill_interval_print_form/@types';
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

export const promiseGetBlobRefill = async (payloadOwn: RefillReportForm, filter: OneRegistryData['list']['processed']['filterValues']) => {
  const {registryKey, ...restPayload} = payloadOwn;
  const localStorageColumns = JSON.parse(localStorage.getItem(`columnContorol`));
  const registryColumns: Array<{key: string; hidden: boolean;}> = localStorageColumns && localStorageColumns[registryKey] || []; 
  let response = null;
  const payload: any = {
    ...restPayload,
    format: 'xls'
  };
  const registryColumnsStr = registryColumns.reduce((a, b) => !b.hidden ? (!a.length ? a + b.key : a + `,${b.key}`) : a, '');
  if(registryColumnsStr.length) {
    payload.columns = registryColumnsStr;
  }
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