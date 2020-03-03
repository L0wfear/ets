import { Dt } from './@types';
import { DTService } from 'api/Services';

export const promiseUpdateDt = (formState: Dt) => {
  const payload = {
    ...formState,
  };

  return DTService.put(payload, false, 'json');
};
