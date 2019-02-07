import {
  OrderService,
} from 'api/Services';
import { get } from 'lodash';
import { Order } from './@types';

export const promiseLoadOrderById = async (id: Order['id']) => {
  const responce = await OrderService.get({ id });
  const order = get(responce, 'result.0', null);

  return order;
};
