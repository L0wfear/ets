import {
  OrderService,
} from 'api/Services';
import { get } from 'lodash';
import { Order, OrderHistory } from './@types';
import { saveData } from 'utils/functions';
import { TypeDownload } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { MissionTemplateCarService } from 'api/missions';

export const promiseLoadOrderById = async (id: Order['id']) => {
  const responce = await OrderService.get({ id });
  const order: Order = get(responce, 'result.0', null);

  return order;
};

export const promiseLoadOrderHistory = async (id: Order['id']) => {
  let responce = null;

  try {
    responce = await OrderService.path(id).path('history').get();
  } catch {
    //
  }
  const result: Array<OrderHistory> = get(responce, 'result.rows', null);

  return result;
};

export const promiseLoadOrderBlob = async (id: Order['id'], eventName: typeof TypeDownload[keyof typeof TypeDownload], registryKey?: string) => {
  const localStorageColumns = registryKey && JSON.parse(localStorage.getItem(`columnContorol`));
  const registryColumns: Array<{key: string; hidden: boolean;}> = localStorageColumns && localStorageColumns[registryKey] || []; 
  const payload: any = {};
  if (eventName === TypeDownload.new) {
    payload.format = 'xls';
  }
  const registryColumnsStr = registryColumns.reduce((a, b) => !b.hidden ? (!a.length ? a + b.key : a + `,${b.key}`) : a, '');
  if(registryColumnsStr.length) {
    payload.columns = registryColumnsStr;
  }
  const response: { blob: Blob; fileName: string; } = await OrderService.path(id).getBlob(payload);

  return response;
};

export const promiseLoadOrderBlobAndSave = (id: Order['id'], eventName: typeof TypeDownload[keyof typeof TypeDownload], registryKey?: string) => {
  return promiseLoadOrderBlob(id, eventName, registryKey)
    .then(({ blob, fileName }) => saveData(blob, fileName));
};

export const promiseGetMissionTemplatesCars = async (payload: { order_id: Order['id' ];}) => {
  let responce = null;

  try {
    responce = await MissionTemplateCarService.get(payload);
  } catch {
    //
  }
  const result: Array<Car> = get(responce, 'result.rows') || [];

  return result;
};
