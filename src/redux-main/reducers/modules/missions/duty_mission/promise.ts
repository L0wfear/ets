import {
  get, cloneDeep,
} from 'lodash';
import {
  DutyMissionPrintService,
  DutyMissionService,
} from 'api/missions/index';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';
import { DutyMissionArchiveService } from 'api/missions';
import { DUTY_MISSION_STATUS_LABELS } from './constants';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { isNullOrUndefined } from 'util';

export const getFrontDutyMission = (dutyMissionRaw: Omit<DutyMission, 'status_name' | 'brigade_employee_id_list_fio' | 'brigade_employee_id_list_id'>): DutyMission => {
  const brigade_employee_id_list = get(dutyMissionRaw, 'brigade_employee_id_list', []) || [];

  const dutyMission: DutyMission = {
    ...dutyMissionRaw,
    status_name: DUTY_MISSION_STATUS_LABELS[dutyMissionRaw.status],
    brigade_employee_id_list_id: brigade_employee_id_list.map(({ employee_id }) => employee_id),
    brigade_employee_id_list_fio: brigade_employee_id_list.map(({ employee_fio }) => employee_fio),
  };

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

  const data: Array<DutyMission> = get(response, ['result', 'rows'], []).map((dutyMission) => (
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

  if (dutyMission) {
    return getFrontDutyMission(dutyMission);
  }

  return null;
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

export const promiseSubmitDutyMission = async (missionOwn: DutyMission) => {
  const mission = cloneDeep(missionOwn);

  try {
    mission.consumable_materials = mission.consumable_materials.map((rowData) => ({
      ...rowData,
      plan_value: isNullOrUndefined(rowData.plan_value) ? rowData.plan_value : getNumberValueFromSerch(rowData.plan_value),
      fact_value: isNullOrUndefined(rowData.fact_value) ? rowData.fact_value : getNumberValueFromSerch(rowData.fact_value),
      consumption: isNullOrUndefined(rowData.consumption) ? rowData.consumption : getNumberValueFromSerch(rowData.consumption),
    }));
  } catch {
    //
  }

  if (mission.id) {
    return promiseUpdateDutyMission(mission);
  }
  return promiseCreateDutyMission(mission);
};

export const promiseChangeArchiveDutuMissionStatus = async (id: DutyMission['id'], is_archive: boolean) => {
  const responce = await DutyMissionArchiveService.path(id).put({ is_archive }, false, 'json');

  return get(responce, 'result.rows.0', null);
};

export const promiseRemoveDutyMissions = async (ids: Array<number>) => {
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
