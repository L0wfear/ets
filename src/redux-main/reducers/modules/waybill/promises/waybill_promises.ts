import { WaybillService } from 'api/Services';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import {
  get,
} from 'lodash';

/* ------------- COMPANY ------------- */
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
