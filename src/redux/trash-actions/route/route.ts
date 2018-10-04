import {
  getRouteDataById
} from 'redux/trash-actions/route/promise';
import { TypeMeta } from 'redux/trash-actions/@types/common.h';

export const loadRouteDataById = (type, id, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: getRouteDataById(id).then(({ route_data }) => ({
      route_data,
    })
  ),
  meta: {
    ...meta,
  }
});
