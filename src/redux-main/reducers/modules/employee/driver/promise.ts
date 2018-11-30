import {
  employeeLoadDriver,
} from 'redux-main/reducers/modules/employee/promises';
import { keyBy, get } from 'lodash';
import createFio from 'utils/create-fio';

export const getDriver = employeeLoadDriver;

const withDriverFioPositionLicense = (rowData) => {
  const {
    position_name,
  } = rowData;

  const driverFio = createFio(rowData, true);

  const drivers_license = get(rowData, 'drivers_license', '') || '';
  const special_license = get(rowData, 'special_license', '') || '';

  rowData.fio_license = `${driverFio} | ${position_name} ${drivers_license ? `${drivers_license} ` : ''}${special_license}`;

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
