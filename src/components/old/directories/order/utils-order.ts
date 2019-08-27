import {
  OrderService,
} from 'api/Services';
import { saveData } from 'utils/functions';
import { TypeDownload } from 'components/old/directories/order/constant-order';

export const promiseLoadOrderBlob = async ({ id }, eventName) => {
  const payload: any = {};
  if (eventName === TypeDownload.new) {
    payload.format = 'xls';
  }
  const response: { blob: Blob; fileName: string } = await OrderService.path(id).getBlob(payload);

  return response;
};

export const promiseLoadOrderBlobAndSave = ({ id }, eventName) => {
  return promiseLoadOrderBlob({ id }, eventName)
    .then(({ blob, fileName }) => saveData(blob, fileName));
};
