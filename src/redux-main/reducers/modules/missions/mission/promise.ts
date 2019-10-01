import {
  cloneDeep,
  get,
} from 'lodash';
import { MissionPrintService, MissionService, MissionDataService, MissionReassignationService } from 'api/missions/index';
import {
  Mission,
  GetMissionPayload,
  MissionDataType,
  MissionReassignation,
} from 'redux-main/reducers/modules/missions/mission/@types';

import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';
import { MissionArchiveService } from 'api/missions';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getMissionDataById = async (id: number) => {
  let responce = null;

  try {
    responce = await MissionDataService.path(id).get();
  } catch (error) {
    // tslint:disable-next-line
    console.warn(error);
  }

  const result: MissionDataType = get(responce, 'result', null);

  return result;
};

export const getFrontMission = (missionRaw: any) => {
  if (missionRaw) {
    const mission: Mission = cloneDeep(missionRaw);

    mission.car_gov_numbers = [mission.car_gov_number];
    mission.car_ids = [mission.car_id];
    mission.car_type_ids = [mission.car_type_id];
    mission.car_type_names = [mission.car_type_name];
    mission.car_model_names = [mission.car_model_name];
    mission.car_special_model_names = [mission.car_special_model_name];
    mission.norm_ids = [mission.norm_id];

    return mission;
  }

  return null;
};

export const getBackMission = (missionRaw: any, index): Mission => {
  const mission: Mission & { action_at: string, } = cloneDeep(missionRaw);

  mission.car_gov_number = get(mission.car_gov_number, index, null);
  mission.car_id = get(mission.car_ids, index, null);
  mission.car_type_id = get(mission.car_type_ids, index, null);
  mission.car_type_name = get(mission.car_type_names, index, null);
  mission.car_model_name = get(mission.car_model_names, index, null);
  mission.car_special_model_name = get(mission.car_special_model_names, index, null);
  mission.norm_id = get(mission.norm_ids, index, null);

  const action_at = get(mission, 'action_at', null);
  if (action_at) {
    mission.action_at = createValidDateTime(action_at);
  }

  delete mission.car_gov_numbers;
  delete mission.car_ids;
  delete mission.car_type_ids;
  delete mission.car_type_names;
  delete mission.car_model_names;
  delete mission.car_special_model_names;
  delete mission.norm_ids;
  return mission;
};

export const promiseGetMission = async (payloadOwn: GetMissionPayload) => {
  let response = null;
  const payload = {
    ...payloadOwn,
  };

  if (payloadOwn.filter) {
    payload.filter = JSON.stringify(parseFilterObject(payloadOwn.filter));
  }

  try {
    response = await MissionService.get({ ...payload });
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data: Mission[] = get(response, ['result', 'rows'], []).map((mission) =>
    getFrontMission(mission),
  );

  const total_count: number = get(
    response,
    ['result', 'meta', 'total_count'],
    0,
  );

  return {
    data,
    total_count,
  };
};

export const promiseGetPrintFormMission = async (payloadOwn: any) => {
  return MissionPrintService.postBlob(payloadOwn);
};

export const promiseGetMissionById = async (id: Mission['id']) => {
  const response = await MissionService.get({ id });
  const mission: Mission = get(response, 'result.rows.0', null);

  return getFrontMission(mission);
};

export const promiseCreateMission = async (mission: Partial<Mission>, assign_to_waybill: string[], hidden: boolean): Promise<Partial<Mission>> => {
  const payload: Partial<Mission> | any = cloneDeep(mission);
  payload.date_start = createValidDateTime(payload.date_start);
  payload.date_end = createValidDateTime(payload.date_end);
  payload.hidden = hidden;

  if (payload.waybill_id === -1) {
    delete payload.waybill_id;
  }

  if (mission.for_column) {
    const responceColumn = await MissionService.path('column').post(
      {
        missions: payload.car_ids.map((car_id, index) => {
          const newObj: Mission = {
            ...payload,
            consumable_materials: null,
            assign_to_waybill: assign_to_waybill[index],
          };

          return getBackMission(newObj, index);
        }),
      },
      false,
      'json',
    );

    return responceColumn;
  }

  const responce = await MissionService.post(
    {
      ...getBackMission(payload, 0),
      assign_to_waybill: assign_to_waybill[0],
    },
    false,
    'json',
  );

  return get(responce, 'result', null);
};

export const promiseUpdateMission = async (payloadOwn: Partial<Mission>): Promise<Partial<Mission>> => {
  const response = await MissionService.put(
    {
      ...getBackMission(payloadOwn, 0),
    },
    false,
    'json',
  );

  return {
    ...payloadOwn,
    ...get(response, 'result.0', null),
  };
};

export const promiseSubmitMission = async (mission: Mission, assign_to_waybill?: string[]) => {
  if (mission.id) {
    return promiseUpdateMission(mission);
  }
  return promiseCreateMission(mission, assign_to_waybill, false);
};

export const promiseChangeArchiveMissionStatus = async (
  id: Mission['id'],
  is_archive: boolean,
) => {
  const responce = await MissionArchiveService.path(id).put(
    { is_archive },
    false,
    'json',
  );

  return getFrontMission(get(responce, 'result.rows.0', null));
};

export const promiseRemoveMissions = async (ids: number[]) => {
  return Promise.all(ids.map((idNumber) => promiseRemoveMission(idNumber)));
};

export const promiseRemoveMission = async (
  id: number,
): Promise<Partial<Mission>> => {
  return MissionService.delete({ id }, false, 'json');
};

export const promiseGetMissionReassignationParameters = async (payload: {car_id: Car['asuods_id'], mission_id: Mission['id'] }) => {
  let response = null;
  try {
    response = await MissionReassignationService.get(payload);
  } catch {
    //
  }

  const result: MissionReassignation = get(response, 'result');

  return result;
};

type PayloadCreateMission = {
  car_id: Mission['car_id'];
  mission_id: Mission['id'];
  comment: Mission['comment'];
  date_start: Mission['date_start'];
  date_end: Mission['date_end'];
  action_at: string | Date,
  reason_id: string,
  status: string;
};
export const promisePostMissionReassignationParameters = async (payload: PayloadCreateMission) => {
  let response = null;
  try {
    response = await MissionReassignationService.post(
      {
        ...payload,
        date_start: createValidDateTime(payload.date_start),
        date_end: createValidDateTime(payload.date_end),
      },
      false,
      'json',
      );
  } catch {
    //
  }

  return response;
};

export const promisePutMissionReassignationParameters = async (payload: PayloadCreateMission) => {
  let response = null;
  try {
    response = await MissionReassignationService.put(
      {
        ...payload,
        date_start: createValidDateTime(payload.date_start),
        date_end: createValidDateTime(payload.date_end),
      },
      false,
      'json',
      );
  } catch {
    //
  }

  return response;
};
