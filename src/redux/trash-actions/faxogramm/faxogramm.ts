import { saveFaxogramm } from 'redux/trash-actions/faxogramm/promise';
import { TypeMeta } from 'redux/trash-actions/@types/common.h';

export const saveFaxogrammBlob = (type, id, payload = {}, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: saveFaxogramm(id, payload),
  meta: {
    ...meta,
  }
});
