import {
  cloneDeep,
  get,
} from 'lodash';
import { MissionPrintService, MissionService, MissionDataService } from 'api/missions/index';
import {
  Mission,
  GetMissionPayload,
} from 'redux-main/reducers/modules/missions/mission/@types';

import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';
import { MissionArchiveService } from 'api/missions';
import { createValidDateTime } from 'utils/dates';
import { MissionDataType } from 'redux-main/trash-actions/mission/@types/promise-mission.h';

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
  const mission: Mission = cloneDeep(missionRaw);

  mission.car_gov_number = get(mission.car_gov_number, index, null);
  mission.car_id = get(mission.car_ids, index, null);
  mission.car_type_id = get(mission.car_type_ids, index, null);
  mission.car_type_name = get(mission.car_type_names, index, null);
  mission.car_model_name = get(mission.car_model_names, index, null);
  mission.car_special_model_name = get(mission.car_special_model_names, index, null);
  mission.norm_id = get(mission.norm_ids, index, null);

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

export const promiseCreateMission = async (mission: Partial<Mission>, assign_to_waybill: string[], hidden: boolean) => {
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

          const newObj = {
            ...payload,
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

  return get(responce, 'result', null) as Partial<Mission>;
};

export const promiseUpdateMission = async (payloadOwn: Partial<Mission>) => {
  const responce = await MissionService.put(
    {
      ...getBackMission(payloadOwn, 0),
    },
    false,
    'json',
  );

  return get(responce, 'result', null) as Partial<Mission>;
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
