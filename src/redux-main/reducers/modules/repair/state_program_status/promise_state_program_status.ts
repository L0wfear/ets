import { StateProgramStatusService } from 'api/Services';
import { get } from 'lodash';
import { StateProgramStatus } from './@types/stateProgramStatus';

export const promiseLoadStateProgramStatus = async (payload: any) => {
  const response = await StateProgramStatusService.get(
    {
      ...payload,
    },
  );

  const result: StateProgramStatus[] = get(response, 'result.rows', []);

  return result;
};
