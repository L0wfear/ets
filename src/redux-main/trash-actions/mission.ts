import {
  getMissionDataById,
} from 'redux-main/trash-actions/mission/promise';

import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

/**
 * используй в meta = { loading: true } для старого отслежтивания состояния загрузки
 */
export const loadMissionDataById = (type, id, meta = { loading: true } as TypeMeta) => {
  return {
    type,
    payload: getMissionDataById(id),
    meta: {
      ...meta,
    },
  };
};
