import { CleaningRate } from "./@types/cleaningRate";
import { CleaningRateService } from "api/Services";
import { get } from 'lodash';

export const promiseCreateCleaningRate = async (cleaningRateNew: CleaningRate) => {
  const response = await CleaningRateService.post(
    {
      ...cleaningRateNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: CleaningRate = {
    ...cleaningRateNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateCleaningRate = async (cleaningRate: CleaningRate) => {
  const response = await CleaningRateService.path(cleaningRate.id).put(
    {
      ...cleaningRate,
    },
    false,
    'json',
  );

  const result: CleaningRate = {
    ...cleaningRate,
    ...get(response, 'result.0', {}),
  };

  return result;
};
