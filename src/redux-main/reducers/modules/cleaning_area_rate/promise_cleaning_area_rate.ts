import { get } from 'lodash';
import { CleaningAreaRateService } from 'api/Services';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';

export const promiseSubmitCleaningAreaRate = (cleaningAreaRate: CleaningAreaRate) => {
  if (!cleaningAreaRate.id) {
    return promiseCreateCleaningAreaRate(cleaningAreaRate);
  }

  return promiseUpdateCleaningAreaRate(cleaningAreaRate);
};

export const promiseCreateCleaningAreaRate = async (cleaningAreaRateNew: CleaningAreaRate) => {
  const response = await CleaningAreaRateService.post(
    {
      ...cleaningAreaRateNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: CleaningAreaRate = {
    ...cleaningAreaRateNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateCleaningAreaRate = async (cleaningAreaRate: CleaningAreaRate) => {
  const response = await CleaningAreaRateService.path(cleaningAreaRate.id).put(
    {
      ...cleaningAreaRate,
    },
    false,
    'json',
  );

  const result: CleaningAreaRate = {
    ...cleaningAreaRate,
    ...get(response, 'result.0', {}),
  };

  return result;
};
