import { get } from 'lodash';
import {
  MissionTemplateService,
  MissionTemplatePrintService,
} from 'api/missions/index';
import { MissionTemplate } from './@types/index.h';

export const promiseGetMissionTemplate = async (payload) => {
  let response = null;
  try {
    response = await MissionTemplateService.get({ ...payload });
  } catch (error) {
    console.warn(error); // tslint:disable-line
    response = null;
  }

  const data = get(response, ['result'], []);

  return {
    data,
  };
};

export const promiseGetPrintFormMissionTemplate = async (payload: any) => {
  return MissionTemplatePrintService.postBlob({ ...payload });
};

export const promiseCreateMissionTemplate = async (
  payload: Partial<MissionTemplate>,
) => {
  const response = await MissionTemplateService.post(
    { ...payload },
    false,
    'json',
  );

  const data: Partial<MissionTemplate> = get(response, ['result', 0], null);

  return {
    ...payload,
    ...data,
  };
};

export const promiseUpdateMissionTemplate = async (
  payload: Partial<MissionTemplate> & Pick<MissionTemplate, 'id'>,
) => {
  const response = await MissionTemplateService.put(
    { ...payload },
    false,
    'json',
  );

  const data: Partial<MissionTemplate> = get(response, ['result', 0], null);

  return {
    ...payload,
    data,
  };
};

export const promiseRemoveMissionTemplates = async (ids: Array<number>) => {
  return Promise.all(
    ids.map((idNumber) => promiseRemoveMissionTemplate(idNumber)),
  );
};

export const promiseRemoveMissionTemplate = async (
  id: number,
): Promise<Partial<MissionTemplate>> => {
  return MissionTemplateService.delete({ id }, false, 'json');
};
