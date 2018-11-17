import { getWaybillById } from 'redux-main/waybill/promise';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const loadWaybillById = (type, id, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: getWaybillById(id),
  meta: {
    ...meta,
  },
});
