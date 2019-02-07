import {
  get,
} from 'lodash';
import { MissionService } from 'api/missions/index';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { createValidDateTime } from 'utils/dates';
import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';

export const promiseGetMission = async (payloadOwn: any) => {
  let response = null;
  const payload = {
    ...payloadOwn,
  };

  if (payloadOwn.filter) {
    payload.filter = JSON.stringify(parseFilterObject(payloadOwn.filter));
  }
  try {
    response = await MissionService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data: Mission[] = get(response, ['result', 'rows'], []).map((employee) => {
    const brigade_employee_id_list = get(employee, 'brigade_employee_id_list', []) || [];

    employee.brigade_employee_id_list_id = brigade_employee_id_list.map(({ employee_id }) => employee_id);
    employee.brigade_employee_id_list_fio = brigade_employee_id_list.map(({ employee_fio }) => employee_fio);

    return employee;
  });

  const total_count: number = get(response, ['result', 'meta', 'total_count'], 0);

  return {
    data,
    total_count,
  };
};

export const promiseCreateMission = async (payloadOwn: Partial<Mission>) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);
  payload.plan_date_start = createValidDateTime(payload.plan_date_start);
  payload.plan_date_end = createValidDateTime(payload.plan_date_end);
  payload.fact_date_start = createValidDateTime(payload.fact_date_start);
  payload.fact_date_end = createValidDateTime(payload.fact_date_end);

  const response = await MissionService.post(
    { ...payload },
    false,
    'json',
  );

  const dutyMission: Partial<Mission> = get(response, ['result', 0],  null);

  return dutyMission;
};

export const promiseUpdateMission = async (payloadOwn: Partial<Mission>) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;

  payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(({ employee_id }) => employee_id);
  payload.plan_date_start = createValidDateTime(payload.plan_date_start);
  payload.plan_date_end = createValidDateTime(payload.plan_date_end);
  payload.fact_date_start = createValidDateTime(payload.fact_date_start);
  payload.fact_date_end = createValidDateTime(payload.fact_date_end);

  const response = await MissionService.put(
    { ...payload },
    false,
    'json',
  );

  const dutyMission = get(response, ['result', 0],  null);

  return dutyMission;
};

export const promiseRemoveMissions = async (ids: number[]) => {
  return Promise.all(
    ids.map((idNumber) => (
      promiseRemoveMission(idNumber)
    )),
  );
};

export const promiseRemoveMission = async (id: number): Promise<Partial<Mission>> => {
  return MissionService.delete(
    { id },
    false,
    'json',
  );
};
