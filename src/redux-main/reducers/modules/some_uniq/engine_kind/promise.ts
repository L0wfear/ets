import { EngineKindService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetEngineKind = async (payload) => {
  let response = null;
  try {
    response = await EngineKindService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
