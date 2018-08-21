import {
  MissionService,
  MissionDataService,
} from 'api/missions';

export const loadMissionById = (type, id) => {
  const payload = {
    id,
  };
  return {
    type,
    payload: MissionService.get(payload)
      .catch((error) => {
        console.warn(error);

        return {
          result: {
            rows: [],
          },
        };
      })
      .then(({ result: { rows: [mission] } }) => ({
        mission,
        id,
      })),
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
