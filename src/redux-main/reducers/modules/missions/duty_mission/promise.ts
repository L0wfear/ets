import {
  get,
} from 'lodash';
import { DutyMissionService } from 'api/missions/index';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { createValidDateTime } from 'utils/dates';

export const promiseGetDutyMission = async (payload) => {
  let response = null;
  try {
    response = await DutyMissionService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data: DutyMission[] = get(response, ['result'], []).map((employee) => {
    const brigade_employee_id_list = get(employee, 'brigade_employee_id_list', []) || [];

    employee.brigade_employee_id_list_id = brigade_employee_id_list.map(({ employee_id }) => employee_id);
    employee.brigade_employee_id_list_fio = brigade_employee_id_list.map(({ employee_fio }) => employee_fio);

    return employee;
  });
  const total_count: number = get(response, ['meta', 'total_count'], 0);

  return {
    data,
    total_count,
  };
};

export const promiseCreateDutyMission = async (payloadOwn: Partial<DutyMission>) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);
  payload.plan_date_start = createValidDateTime(payload.plan_date_start);
  payload.plan_date_end = createValidDateTime(payload.plan_date_end);
  payload.fact_date_start = createValidDateTime(payload.fact_date_start);
  payload.fact_date_end = createValidDateTime(payload.fact_date_end);

  const response = await DutyMissionService.post(
    { ...payload },
    false,
    'json',
  );

  const dutyDutyMission: Partial<DutyMission> = get(response, ['result', 0],  null);

  return dutyDutyMission;
};

export const promiseUpdateDutyMission = async (payloadOwn: Partial<DutyMission>) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);
  payload.plan_date_start = createValidDateTime(payload.plan_date_start);
  payload.plan_date_end = createValidDateTime(payload.plan_date_end);
  payload.fact_date_start = createValidDateTime(payload.fact_date_start);
  payload.fact_date_end = createValidDateTime(payload.fact_date_end);

  const response = await DutyMissionService.put(
    { ...payload },
    false,
    'json',
  );

  const dutyDutyMission = get(response, ['result', 0],  null);

  return dutyDutyMission;
};

export const promiseRemoveDutyMissions = async (ids: number[]) => {
  return Promise.all(
    ids.map((idNumber) => (
      promiseRemoveDutyMission(idNumber)
    )),
  );
};

export const promiseRemoveDutyMission = async (id: number): Promise<Partial<DutyMission>> => {
  return DutyMissionService.delete(
    { id },
    false,
    'json',
  );
};
