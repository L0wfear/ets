import { CarsTravelTimeDetailService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetCarsTravelTime = async (payload) => {
  let response = null;
  try {
    response = await CarsTravelTimeDetailService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result'], []);

  return {
    data,
  };
};
