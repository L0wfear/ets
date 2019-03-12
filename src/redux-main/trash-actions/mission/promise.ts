import {
  MissionDataService,
} from 'api/missions';

export const getMissionDataById = (id) => (
  MissionDataService.path(id).get()
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: null,
      };
    })
    .then(({ result }) => ({
      mission_data: result,
      id,
    }))
);
