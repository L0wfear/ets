import { CleaningMunicipalFacilityService, CleaningMunicipalFacilityMeasureUnitService } from 'api/Services';
import { get } from 'lodash';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { MunicipalFacility, MunicipalFacilityMeasureUnit } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';

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

  const result: Array<MunicipalFacility> = get(response, ['result', 'rows'], []);

  return result;
};

export const promiseGetMunicipalFacilityMeasureUnit = async (payloadOwn) => {
  const payload = {
    ...payloadOwn,
  };

  let response = null;
  try {
    response = await CleaningMunicipalFacilityMeasureUnitService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const result: Array<MunicipalFacilityMeasureUnit> = get(response, ['result', 'rows'], []);

  return result;
};
