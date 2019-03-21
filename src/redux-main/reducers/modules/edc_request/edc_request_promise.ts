import { EdcRequestService } from "api/Services";
import { get } from 'lodash';
import { EdcRequest } from "./@types";

export const promiseLOadEdcRequesById = async (id: number) => {
  let response = null;

  try {
    response = await EdcRequestService.get(
      { id },
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const edc_request: EdcRequest = get(response, 'result.0', null);

  return edc_request;
};
