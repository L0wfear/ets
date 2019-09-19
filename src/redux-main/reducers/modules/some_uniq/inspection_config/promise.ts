import { get } from 'lodash';
import { InspectionConfig } from './@types';
import { InspectionConfigService } from 'api/Services';

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
