import { getWaybillById } from 'redux/waybill/promise';
import { TypeMeta } from 'redux/trash-actions/@types/common.h';

export const loadWaybillById = (type, id, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: getWaybillById(id),
  meta: {
    ...meta,
  }
});
