import {
  OrderService,
} from 'api/Services';
import { saveData } from 'utils/functions';
import { TypeDownload } from 'components/directories/order/constant-order';

export const getBlobOrder = ({ id }, eventName) => {
  const payload: any = {};
  if (eventName === TypeDownload.new) {
    payload.format = 'xls';
  }
  OrderService.path(id).getBlob(payload)
    .then(({ blob, fileName }) => saveData(blob, fileName));
};
