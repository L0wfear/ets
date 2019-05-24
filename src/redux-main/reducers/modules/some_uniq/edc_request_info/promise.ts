import { EdcRequestInfoDetailService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetEdcRequestInfo = async (payload: {id: number, original: boolean}) => {
  let response = null;

  const id = get(payload, 'id', null);
  const original = get(payload, 'original', null);
  try {
    // через path перекинуть id
    // формат /edc/request/<id>/info/?original=true
    response = await EdcRequestInfoDetailService.path(`${id}/info`).get({original});
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, 'result.rows', []);

  return {
    data,
  };
};
