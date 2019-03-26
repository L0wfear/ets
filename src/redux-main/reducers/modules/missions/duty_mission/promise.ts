import {
  get,
} from 'lodash';
import {
  DutyMissionPrintService,
  DutyMissionService,
} from 'api/missions/index';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { createValidDateTime } from 'utils/dates';

import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';
import { DutyMissionArchiveService } from 'api/missions';

export const getFrontDutyMission = (dutyMissionRaw: any) => {
  const dutyMission: DutyMission = { ...dutyMissionRaw };

  const brigade_employee_id_list = get(dutyMissionRaw, 'brigade_employee_id_list', []) || [];

  dutyMission.brigade_employee_id_list_id = brigade_employee_id_list.map(({ employee_id }) => employee_id);
  dutyMission.brigade_employee_id_list_fio = brigade_employee_id_list.map(({ employee_fio }) => employee_fio);

  return dutyMission;
};

export const promiseGetDutyMission = async (payloadOwn: any) => {
  let response = null;
  const payload = {
    ...payloadOwn,
  };

  if (payloadOwn.filter) {
    payload.filter = JSON.stringify(parseFilterObject(payloadOwn.filter));
  }

  try {
    response = await DutyMissionService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data: DutyMission[] = get(response, ['result', 'rows'], []).map((dutyMission) => (
    getFrontDutyMission(dutyMission)
  ));

  const total_count: number = get(response, ['result', 'meta', 'total_count'], 0);

  return {
    data,
    total_count,
  };
};

export const promiseGetPrintFormDutyMission = async (id: DutyMission['id']) => {
  return DutyMissionPrintService.getBlob({ duty_mission_id: id });
};

export const promiseGetDutyMissionById = async (id: DutyMission['id']) => {
  const response = await DutyMissionService.get({ id });
  const dutyMission: DutyMission = get(response, 'result.rows.0', null);

  return getFrontDutyMission(dutyMission);
};

export const promiseCreateDutyMission = async (payloadOwn: Partial<DutyMission>) => {
  const payload: any = { ...payloadOwn };

  delete payload.brigade_employee_id_list_fio;
  delete payload.brigade_employee_id_list_id;
  delete payload.is_archive;

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
  delete payload.is_archive;

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

export const promiseChangeArchiveDutuMissionStatus = async (id: DutyMission['id'], is_archive: boolean) => {
  const responce = await DutyMissionArchiveService.path(id).put({ is_archive }, false, 'json');

  return get(responce, 'result.rows.0', null);
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
