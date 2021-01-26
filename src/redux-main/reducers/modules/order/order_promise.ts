import {
  OrderService,
} from 'api/Services';
import { get } from 'lodash';
import { Order, OrderHistory } from './@types';
import { saveData } from 'utils/functions';
import { TypeDownload } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { MissionTemplateCarService } from 'api/missions';

export const promiseLoadOrderList = async (payload) => {
  let response = null;
  try {
    response = await OrderService.get(payload);
  } catch (error) {
    //
  }

  const data: Array<Order> = get(response, 'result', []);
  return {
    data,
  };
};

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

export const promiseLoadOrderBlob = async (id: Order['id'], eventName: typeof TypeDownload[keyof typeof TypeDownload]) => {
  const payload: any = {};
  if (eventName === TypeDownload.new) {
    payload.format = 'xls';
  }
  const response: { blob: Blob; fileName: string; } = await OrderService.path(id).getBlob(payload);

  return response;
};

export const promiseLoadOrderBlobAndSave = (id: Order['id'], eventName: typeof TypeDownload[keyof typeof TypeDownload]) => {
  return promiseLoadOrderBlob(id, eventName)
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
