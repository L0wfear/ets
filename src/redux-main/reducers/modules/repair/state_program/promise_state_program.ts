import { StateProgram } from './@types/stateProgram';
import { StateProgramService } from 'api/Services';
import { get } from 'lodash';

export const promiseCreateStateProgram = async (contractorNew: StateProgram) => {
  const response = await StateProgramService.post(
    {
      ...contractorNew,
    },
    false,
    'json',
  );

  const result: StateProgram = {
    ...contractorNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateStateProgram = async (contractor: StateProgram) => {
  const response = await StateProgramService.path(contractor.id).put(
    {
      ...contractor,
    },
    false,
    'json',
  );

  const result: StateProgram = {
    ...contractor,
    ...get(response, 'result.0', {}),
  };

  return result;
};
