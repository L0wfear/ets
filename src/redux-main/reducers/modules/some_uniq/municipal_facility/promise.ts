import { CleaningMunicipalFacilityService } from 'api/Services';
import { get } from 'lodash';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const promiseGetMunicipalFacility = async (payloadOwn) => {
  const payload = {
    ...payloadOwn,
    start_date: createValidDate(payloadOwn.start_date),
    end_date: createValidDate(payloadOwn.end_date),
  };

  let response = null;
  try {
    response = await CleaningMunicipalFacilityService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
