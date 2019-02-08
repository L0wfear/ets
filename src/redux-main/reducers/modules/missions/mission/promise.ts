import {
  get,
} from 'lodash';
import {
  MissionPrintService,
  MissionService,
} from 'api/missions/index';
import { Mission, GetMissionPayload } from 'redux-main/reducers/modules/missions/mission/@types';

import { parseFilterObject } from 'redux-main/reducers/modules/missions/utils';
import { MissionArchiveService } from 'api/missions';

const getFrontMission = (missionRaw: any) => {
  const mission: Mission = { ...missionRaw };

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
    response = await MissionService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data: Mission[] = get(response, ['result', 'rows'], []).map((mission) => (
    getFrontMission(mission)
  ));

  const total_count: number = get(response, ['result', 'meta', 'total_count'], 0);

  return {
    data,
    total_count,
  };
};

export const promiseGetPrintFormMission = async (id: Mission['id']) => {
  return MissionPrintService.getBlob({ mission_id: id });
};

export const promiseGetMissionById = async (id: Mission['id']) => {
  const response = await MissionService.get({ id });
  const mission: Mission = get(response, 'result.rows.0', null);

  return getFrontMission(mission);
};

export const promiseCreateMission = async (payloadOwn: Partial<Mission>) => {
  throw new Error('non define promiseCreateMission');
};

export const promiseUpdateMission = async (payloadOwn: Partial<Mission>) => {
  throw new Error('non define promiseUpdateMission');
};

export const promiseChangeArchiveDutuMissionStatus = async (id: Mission['id'], is_archive: boolean) => {
  const responce = await MissionArchiveService.path(id).put({ is_archive }, false, 'json');

  return get(responce, 'result.rows.0', null);
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
