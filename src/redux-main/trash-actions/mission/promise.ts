import {
  MissionService,
  MissionDataService,
  DutyMissionService,
} from 'api/missions';

import {
  keyBy,
  cloneDeep,
} from 'lodash';
import { createValidDateTime } from 'utils/dates';

export const getMissionById = (id) => (
  MissionService.get({ id })
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
    }))
);

export const getMissionDataById = (id) => (
  MissionDataService.path(id).get()
    .catch((error) => {
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

export const getDutyMissionById = (id) => (
  DutyMissionService.get({ id })
    .catch((error) => {
      console.warn(error);

      return {
        result: {
          rows: [{}],
        },
      };
    })
    .then(({ result: { rows: [duty_mission] } }) => {
      return {
        duty_mission: {
          ...duty_mission,
          brigadeEmployeeIdIndex: keyBy(duty_mission.brigade_employee_id_list, 'employee_id'),
          brigade_employee_id_list: duty_mission.brigade_employee_id_list.map(({ employee_id }) => employee_id),
        },
      };
    })
);

export const updateDutyMission = (duty_mission) => {
  const payload = cloneDeep(duty_mission);

  delete payload.number;
  delete payload.technical_operation_name;
  delete payload.route_name;
  delete payload.foreman_fio;
  delete payload.car_mission_name;

  payload.plan_date_start = createValidDateTime(payload.plan_date_start);
  payload.plan_date_end = createValidDateTime(payload.plan_date_end);
  payload.fact_date_start = createValidDateTime(payload.fact_date_start);
  payload.fact_date_end = createValidDateTime(payload.fact_date_end);

  return DutyMissionService.put(payload, false, 'json');
}