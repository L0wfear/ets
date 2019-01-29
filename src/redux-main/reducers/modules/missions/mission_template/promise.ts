import { get } from 'lodash';
import { MissionTemplateService } from 'api/missions/index';

export const promiseGetMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await MissionTemplateService.get(
      { ...payload },
    );
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data = get(response, ['result'], []);

  return {
    data,
  };
};

export const promiseCreateMissionTemplate = async (payload) => {
  const response = await MissionTemplateService.post(
    { ...payload },
    false,
    'json',
  );

  const missionTemplate = get(response, ['result', 0],  null);

  return {
    missionTemplate,
  };
};

export const promiseUpdateMissionTemplate = async (payload) => {
  const response = await MissionTemplateService.put(
    { ...payload },
    false,
    'json',
  );

  const missionTemplate = get(response, ['result', 0],  null);

  return {
    missionTemplate,
  };
};

export const promiseRemoveMissionTemplates = async (ids: number[]) => {
  return Promise.all(
    ids.map((idNumber) => (
      promiseRemoveMissionTemplate(idNumber)
    )),
  );
};

export const promiseRemoveMissionTemplate = async (id: number) => {
  return MissionTemplateService.delete(
    { id },
    false,
    'json',
  );
};
