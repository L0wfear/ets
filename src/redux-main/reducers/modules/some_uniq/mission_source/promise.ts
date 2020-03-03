import { MissionSourceService } from 'api/Services';
import { get } from 'lodash';
import { MissionSource } from './@types';

export const promiseGetMissionSource = async (payload: object) => {
  let response = null;

  try {
    response = await MissionSourceService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Array<MissionSource> = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
