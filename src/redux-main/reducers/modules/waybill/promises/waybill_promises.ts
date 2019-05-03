import { WaybillService, WaybillJournalReportService, WaybillsReportService } from 'api/Services';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import {
  get,
} from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { monthOptions, makeDate } from 'utils/dates';

/* ------------- WAYBILL ------------- */
export const promiseGetWaybill = async (payload = {}) => {
  throw new Error('Define promiseGetWaybill');
};

export const promiseLoadPFWaybill = async (payloadOwn) => {
  throw new Error('Define promiseLoadPFWaybill');
};

export const promiseCreateWaybill = async (ownPayload) => {
  throw new Error('Define promiseCreateWaybill');
};
export const promiseUpdateWaybill = async (ownPayload) => {
  throw new Error('Define promiseUpdateWaybill');
};
export const promiseDeleteWaybill = (id) => {
  throw new Error('Define promiseDeleteWaybill');
};

export const promiseGetWaybillById = async (id: Waybill['id']) => {
  let response = null;
  try {
    response = await WaybillService.path(id).get();
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const waybill: Waybill = get(response, 'result', null);

  if (waybill) {
    waybill.tax_data = (get(waybill, 'tax_data', []) || []).map((tax) => {
      tax.originOperation = true;
      tax.uniqKey = `originOperation_${tax.OPERATION}`;
      tax.operation_name = `${tax.operation_name}, ${
        tax.measure_unit_name
      }`;
      if (tax.comment) {
        tax.operation_name = `${tax.operation_name} (${tax.comment})`;
      }
      if (tax.is_excluding_mileage) {
        tax.operation_name = `${tax.operation_name} [без учета пробега]`;
      }
      return tax;
    });
    waybill.equipment_tax_data = (get(waybill, 'equipment_tax_data', []) || []).map((tax) => {
      tax.originOperation = true;
      tax.uniqKey = `originOperation_${tax.OPERATION}`;
      tax.operation_name = `${tax.operation_name}, ${
        tax.measure_unit_name
      }`;
      if (tax.comment) {
        tax.operation_name = `${tax.operation_name} (${tax.comment})`;
      }
      if (tax.is_excluding_mileage) {
        tax.operation_name = `${tax.operation_name} [без учета пробега]`;
      }
      return tax;
    });
  }

  return waybill;
};

export const promiseGetBlobWaybilljournalReport = async (payload: { date: string } | { month: number, year: number }, filter: OneRegistryData['list']['processed']['filterValues']) => {
  let response = null;
  try {
    response = await WaybillJournalReportService.path(
      `?filter=${JSON.stringify(filter)}`,
    ).postBlob(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let fileName = 'Отчет по журналу ПЛ за';

  if ('month' in payload && payload.month && payload.year) {
    const monthName = get(monthOptions.find(({ value }) => value === payload.month), 'label', '');

    fileName = `${fileName} ${monthName} ${payload.year}.xls`;
  }
  if ('date' in payload && payload.date) {
    fileName = `${fileName} ${makeDate(payload.date)}.xls`;
  }

  return {
    blob: get(response, 'blob', null),
    fileName,
  };
};

export const promiseGetBlobWaybillReport = async (payloadOwn: { date_start: string, date_end: string }, filter: OneRegistryData['list']['processed']['filterValues']) => {
  let response = null;
  const payload: any = {
    ...payloadOwn,
  };

  if (filter) {
    payload.filter = JSON.stringify(filter);
  }

  try {
    response = await WaybillsReportService.getBlob(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let fileName = 'Отчет по выработке ТС за';
  fileName = `${fileName} ${makeDate(payload.date_start)} - ${makeDate(payload.date_end)}.xls`;

  return {
    blob: get(response, 'blob', null),
    fileName,
  };
};
