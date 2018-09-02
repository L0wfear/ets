import { getMissionById, getMissionDataById }  from 'redux/trash-actions/mission/promise';

export const loadMissionById = (type, id) => {
  return {
    type,
    payload: getMissionById(id),
    meta: {
      loading: true,
    },
  };
}

export const loadMissionDataById = (type, id) => {
  return {
    type,
    payload: getMissionDataById(id),
    meta: {
      loading: true,
    },
  };
};
