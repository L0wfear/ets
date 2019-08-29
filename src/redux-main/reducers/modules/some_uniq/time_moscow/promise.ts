import { get } from 'lodash';

import { TimeMoscowService } from 'api/Services';
import { getDateWithMoscowTz, createValidDateTime } from 'components/@next/@utils/dates/dates';

export const loadTimeMoscow = async (payload: object, double?: boolean) => {
  let response = null;

  try {
    response = await TimeMoscowService.get(payload).catch(
      () => {
        if (!double) {
          return loadTimeMoscow({}, true);
        }

        throw new Error('invalid time');
      },
    );
  } catch {
    //
  }

  const default_time = getDateWithMoscowTz();
  const default_date = createValidDateTime(default_time);

  const result: { timestamp: number; date: string } = {
    timestamp: get(response, 'result.timestamp') || +default_time / 1000,
    date: get(response, 'result.date') ||  default_date,
  };

  return result;
};
