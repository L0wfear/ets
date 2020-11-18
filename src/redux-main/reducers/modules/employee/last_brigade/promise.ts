import {
  get,
  uniq,
} from 'lodash';

import { LastBrigadeService } from 'api/Services';
import { LastBrigade } from 'redux-main/reducers/modules/employee/last_brigade/@types';

export const promiseLoadLastBrigade = async ({ id }: { id: number; }) => {
  let respose = null;

  try {
    respose = await LastBrigadeService.path(id).get();
  } catch (error) {
    console.warn(error); // eslint-disable-line
  }

  const lastBrigade: LastBrigade = {
    last_brigade: uniq(get(respose, ['result', 'last_brigade'], [])),
    last_brigade_fios: uniq(get(respose, ['result', 'last_brigade_fios'], [])),
  };

  return lastBrigade;
};
