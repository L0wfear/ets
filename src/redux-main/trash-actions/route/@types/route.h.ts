import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';
import {
  AnsGetRouteDataById,
} from 'redux-main/trash-actions/route/@types/promise.h';

export type AnsLoadRouteDataByIdFunc = {
  type: string,
  payload: AnsGetRouteDataById,
  meta?: TypeMeta,
};

export type loadRouteDataByIdFunc = (
  type: string,
  id: number,
  meta?: TypeMeta,
) => AnsLoadRouteDataByIdFunc;
