import { saveOrder } from 'redux-main/trash-actions/order/promise';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const saveOrderBlob = (type, id, payload = {}, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: saveOrder(id, payload),
  meta: {
    ...meta,
  }
});
