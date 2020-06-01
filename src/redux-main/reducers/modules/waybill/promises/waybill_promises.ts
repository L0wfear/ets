import {
  cloneDeep,
  get,
} from 'lodash';
import { isArray } from 'util';

import { WaybillService, WaybillJournalReportService, WaybillsReportService, LatestWaybillDriverService, WaybillClosedService, RootService, WaybillAvailableMissionsService } from 'api/Services';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { monthOptions, makeDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { hasMotohours, isEmpty } from 'utils/functions';

const updateFieldsToTest = ['fuel_given', 'equipment_fuel_given'];

export const getOneWaybillFront = (waybillRaw) => {
  const waybill: Waybill = waybillRaw;

  if (waybill) {
    if (isArray(waybill.tax_data)) {
      waybill.tax_data = waybill.tax_data.map((tax: any) => {
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
    } else {
      waybill.tax_data = [];
    }

    if (isArray(waybill.equipment_tax_data)) {
      waybill.equipment_tax_data = waybill.equipment_tax_data.map((tax: any) => {
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
    } else {
      waybill.equipment_tax_data = [];
    }
  }

  return waybill;
};

/* ------------- WAYBILL ------------- */
export const promiseGetWaybill = async (payload = {}) => {
  throw new Error('Define promiseGetWaybill');
};

export const promiseLoadPFWaybill = async (payloadOwn) => {
  throw new Error('Define promiseLoadPFWaybill');
};

export const promiseCreateWaybill = async (waybill: Waybill) => {
  // const payload = cloneDeep(waybill);
  const payload = cloneDeep(waybill) as any;
  payload.plan_departure_date = createValidDateTime(
    payload.plan_departure_date,
  );
  payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);

  payload.equipment_fuel = +payload.equipment_fuel;
  delete payload.car_special_model_name;
  delete payload.car_model_name;
  delete payload.garage_number;
  delete payload.all_missions_completed_or_failed;
  delete payload.hasEquipmentFuelRates;

  Object.entries(payload).forEach(
    ([key, value]) => {
      if (isEmpty(value)) {
        delete payload[key];
      }
    },
  );

  if (hasMotohours(payload.gov_number) || payload.car_has_motohours) {
    delete payload.odometr_start;
  } else {
    delete payload.motohours_start;
  }

  if (isEmpty(payload.mission_id_list)) {
    payload.mission_id_list = [];
  }

  if (
    !isEmpty(payload.mission_id_list)
    && payload.mission_id_list.length === 0
  ) {
    payload.mission_id_list = [];
  }

  return WaybillService.post(payload, false, 'json');
};

export const promiseUpdateWaybill = async (waybill: Partial<Waybill>) => {
  // const payload = cloneDeep(waybill);
  const payload = cloneDeep(waybill) as any;
  payload.plan_departure_date = createValidDateTime(
    payload.plan_departure_date,
  );
  payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
  payload.equipment_fuel = +payload.equipment_fuel;

  payload.fact_departure_date = createValidDateTime(
    payload.fact_departure_date,
  );
  payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);

  if (payload.tax_data) {
    const tax_data = payload.tax_data
      .filter((t) => !isEmpty(t.FACT_VALUE))
      .map((tax) => {
        delete tax.originOperation;
        delete tax.isDisabled;
        delete tax.operation_name;
        delete tax.uniqKey;

        return tax;
      });
    payload.tax_data = tax_data;
  }
  if (payload.equipment_tax_data) {
    const equipment_tax_data = payload.equipment_tax_data
      .filter((t) => !isEmpty(t.FACT_VALUE))
      .map((tax) => {
        delete tax.originOperation;
        delete tax.isDisabled;
        delete tax.operation_name;
        delete tax.uniqKey;

        return tax;
      });
    payload.equipment_tax_data = equipment_tax_data;
  }

  updateFieldsToTest.forEach((key) => {
    if (!isEmpty(payload[key])) {
      payload[key] = parseFloat(payload[key]).toFixed(3);
    }
  });

  delete payload.odometr_diff;
  delete payload.motohours_diff;
  delete payload.motohours_equip_diff;
  delete payload.date_create;
  delete payload.closing_date;
  delete payload.all_missions_completed_or_failed;
  delete payload.car_special_model_name;
  delete payload.car_model_name;
  delete payload.garage_number;
  delete payload.hasEquipmentFuelRates;

  if (hasMotohours(payload.gov_number) || payload.car_has_motohours ) {
    delete payload.odometr_start;
  } else {
    delete payload.motohours_start;
  }

  Object.entries(payload).forEach(
    ([key, value]) => {
      if (isEmpty(value)) {
        payload[key] = null;
      }
    },
  );

  if (isEmpty(payload.motohours_equip_start)) {
    payload.motohours_equip_start = null;
  }

  if (isEmpty(payload.mission_id_list)) {
    payload.mission_id_list = [];
  }

  if (
    !isEmpty(payload.mission_id_list)
    && payload.mission_id_list.length === 0
  ) {
    payload.mission_id_list = [];
  }

  return WaybillService.put(payload, false, 'json');
};

export const promiseDeleteWaybill = (id) => {
  throw new Error('Define promiseDeleteWaybill');
};

export const promiseGetWaybillById = async (id: Waybill['id']) => {
  let response = null;
  let hasErrror = false;

  try {
    response = await WaybillService.path(id).get();
  } catch (error) {
    hasErrror = true;
  }

  const waybill: Waybill = get(response, 'result', null);

  if (!waybill && hasErrror) {
    throw new Error('hasErrror');
  }

  return getOneWaybillFront(waybill);
};

export const promiseGetBlobWaybilljournalReport = async (payload: { date: string; } | { month: number; year: number; }, filter: OneRegistryData['list']['processed']['filterValues']) => {
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

export const promiseGetBlobWaybillReport = async (payloadOwn: { date_start: string; date_end: string; }, filter: OneRegistryData['list']['processed']['filterValues']) => {
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

export const promiseGetLatestWaybillDriver = async (payload: {car_id?: number | null; driver_id?: number | null; road_accident_date?: string | null; }) => {
  let response = null;
  try {
    response = await LatestWaybillDriverService.get(payload);
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Employee['id'] = get(response, 'result.driver_id', null);

  return result;
};

export const submitWaybill = async (waybillRaw: Partial<Waybill>) => {
  let response = null;

  if (waybillRaw.id) {
    response = await WaybillService.put(
      {
        ...waybillRaw,
      },
      false,
      'json',
    );
  } else {
    response = await WaybillService.post(
      {
        ...waybillRaw,
      },
      false,
      'json',
    );
  }

  const result: Waybill = {
    ...waybillRaw,
    ...get(response, 'result.0', null),
  };

  return result;
};

export const promiseGetLastClosedWaybill = async (payloadOwn: { car_id: Car['asuods_id']; }) => {
  const payload = {
    car_id: payloadOwn.car_id,
  };
  let response = null;

  try {
    response = await WaybillClosedService.get(payload);
  } catch {
    //
  }

  const result: Waybill = get(response, 'result.rows.0') || get(response, 'result.0') || null;

  return result;
};

type PromisePrintWaybillPayload = {
  type: 'plate_special';
  waybill_id: Waybill['id'];
};
export const promisePrintWaybill = (payload: PromisePrintWaybillPayload) => {
  return RootService.path(payload.type).getBlob({ waybill_id: payload.waybill_id });
};

// возвращает статусы задания, которые мы будем искать, в зависимости от статуса ПЛ
// если у ПЛ нет статуса, то нужны исключительно неназначенные задания!
const getMissionFilterStatus = (waybillStatus) => {
  return waybillStatus ? undefined : 'not_assigned';
};
type PromiseGetMissionsByCarAndDatesPayload = {
  car_id: Waybill['car_id'];
  date_from: Waybill['fact_departure_date'] | Waybill['plan_departure_date'];
  date_to: Waybill['fact_arrival_date'] | Waybill['plan_arrival_date'];
  status: Waybill['status'];
  waybill_id: Waybill['id'];
};
export const promiseGetMissionsByCarAndDates = async (payloadOwn: PromiseGetMissionsByCarAndDatesPayload) => {
  const payload: Dictionary<any> = {};

  const status = getMissionFilterStatus(payloadOwn.status);

  if (!isEmpty(payloadOwn.car_id)) {
    payload.car_id = payloadOwn.car_id;
  }

  if (!isEmpty(payloadOwn.date_from)) {
    payload.date_from = createValidDateTime(payloadOwn.date_from);
  }

  if (!isEmpty(payloadOwn.date_to)) {
    payload.date_to = createValidDateTime(payloadOwn.date_to);
  }

  if (!isEmpty(status)) {
    payload.status = status;
  }

  if (payloadOwn.waybill_id) {
    payload.waybill_id = payloadOwn.waybill_id;
  }

  return WaybillAvailableMissionsService.get(payload);
};
