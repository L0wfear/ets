import {
  MissionService,
  MissionDataService,
} from 'api/missions';

import {
  cloneDeep,
} from 'lodash';
import { createValidDateTime } from 'utils/dates';

export const getMissionById = (id) => (
  MissionService.get({ id })
    .catch((error) => {
      // tslint:disable-next-line
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
    }))
);

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

export const updateMission = (mission) => {
  const payload = cloneDeep(mission);
  payload.date_start = createValidDateTime(payload.date_start);
  payload.date_end = createValidDateTime(payload.date_end);

  delete payload.number;
  delete payload.car_gov_number;
  delete payload.technical_operation_name;
  delete payload.route_name;
  delete payload.mission_source_name;
  delete payload.waybill_number;

  return MissionService.put(payload, false, 'json');
};
