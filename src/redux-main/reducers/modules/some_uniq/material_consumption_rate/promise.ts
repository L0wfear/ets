import { MaterialConsumptionRateService } from 'api/Services';
import { get } from 'lodash';

export const promiseGetConsumptionRateMaterial = async (payload) => {
  let response = null;
  try {
    response = await MaterialConsumptionRateService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data = get(response, ['result', 'rows'], []);

  return {
    data,
  };
};
