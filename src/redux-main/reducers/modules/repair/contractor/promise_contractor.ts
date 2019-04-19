import { Contractor } from './@types/contractor';
import { ContractorService } from 'api/Services';
import { get } from 'lodash';

export const promiseCreateContractor = async (contractorNew: Contractor) => {
  const response = await ContractorService.post(
    {
      ...contractorNew,
    },
    false,
    'json',
  );

  const result: Contractor = {
    ...contractorNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateContractor = async (contractor: Contractor) => {
  const response = await ContractorService.path(contractor.id).put(
    {
      ...contractor,
    },
    false,
    'json',
  );

  const result: Contractor = {
    ...contractor,
    ...get(response, 'result.0', {}),
  };

  return result;
};
