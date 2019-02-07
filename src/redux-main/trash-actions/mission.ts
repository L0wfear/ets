import {
  getMissionById,
  updateMission,
  getMissionDataById,
} from 'redux-main/trash-actions/mission/promise';

import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const loadMissionById: any = (type, id, meta = { loading: true } as TypeMeta) => {
  return {
    type,
    payload: getMissionById(id),
    meta: {
      ...meta,
    },
  };
};

export const updateMissionByPayload = (type, payload, meta = { loading: true } as TypeMeta) => {
  return {
    type,
    payload: updateMission(payload),
    meta: {
      ...meta,
    },
  };
};

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
