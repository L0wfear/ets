import {
  MissionDataService,
} from 'api/missions';

import { getMissionById }  from 'redux/trash-actions/mission/promise';

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
    payload: MissionDataService.path(id).get()
      .catch((error) => {
        console.warn(error);

        return {
          result: null,
        };
      })
      .then(({ result }) => ({
        mission_data: result,
        id,
      })),
    meta: {
      loading: true,
    },
  };
};
