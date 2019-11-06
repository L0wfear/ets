import {
  employeeLoadDriver,
} from 'redux-main/reducers/modules/employee/promises';
import { keyBy, get } from 'lodash';
import { createFio } from 'utils/labelFunctions';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { WaybillDriverService } from 'api/Services';
import { WaybillDriver } from 'redux-main/reducers/modules/employee/driver/@types';

export const getDriver = employeeLoadDriver;

export const makeDriverFioLicenceLabel = (driverFio, position_name, drivers_license, special_license) => {
  return `${driverFio} | ${position_name || ''} ${drivers_license ? `${drivers_license} ` : ''}${special_license || ''}`;
};

const withDriverFioPositionLicense = (rowData) => {
  const {
    position_name,
  } = rowData;

  const driverFio = createFio(rowData, true);

  const drivers_license = get(rowData, 'drivers_license', '') || '';
  const special_license = get(rowData, 'special_license', '') || '';

  rowData.fio_license = makeDriverFioLicenceLabel(driverFio, position_name, drivers_license, special_license);

  return rowData;
};

export const getSetDriver = async (...payload) => {
  const { data: rawData } = await getDriver(...payload);

  const data = rawData.map(withDriverFioPositionLicense);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

type PayloadToGetWaybillDrivers = {
  company_id: Company['company_id'];
  type?: 'before' | 'after';
  date_from: Parameters<typeof createValidDateTime>[0];
  date_to: Parameters<typeof createValidDateTime>[0];
};
export const promiseGetWaybillDriver = async (payloadOwn: PayloadToGetWaybillDrivers) => {
  const payload = {
    ...payloadOwn,
    date_from: createValidDateTime(payloadOwn.date_from),
    date_to: createValidDateTime(payloadOwn.date_to),
    type: payloadOwn.type || 'before',
  };

  let response = null;

  try {
    response = await WaybillDriverService.get(payload);
  } catch {
    //
  }

  const result: Array<WaybillDriver> = get(response, 'result.rows') || [];

  return result;
};
