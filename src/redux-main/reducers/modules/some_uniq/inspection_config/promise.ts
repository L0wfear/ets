import { get } from 'lodash';
import { InspectionConfig } from './@types';
import { InspectionConfigService, CountryService, EngineTypeService } from 'api/Services';
import { Country } from 'redux-main/reducers/modules/some_uniq/country/@types';
import { EngineType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const promiseLoadInspectionConfig = async () => {
  let response = null;

  try {
    response = await InspectionConfigService.get();
  } catch (error) {
    console.error('promiseLoadInspectionConfig Error', error); // tslint:disable-line
  }

  const result: InspectionConfig = get(response, 'enums', []);

  return {
    data: result,
  };
};

export const promiseLoadCountry = async () => {
  let response = null;

  try {
    response = await CountryService.get();
  } catch (error) {
    console.error('Error', error); // tslint:disable-line
  }

  const result: Array<Country> = get(response, 'result.rows', []);

  return {
    list: result,
  };
};

export const promiseLoadAutobaseEngineType = async () => {
  let response = null;

  try {
    response = await EngineTypeService.get();
  } catch (error) {
    console.error('Error', error); // tslint:disable-line
  }

  const result: Array<EngineType> = get(response, 'result.rows', []);

  return {
    list: result,
  };
};
