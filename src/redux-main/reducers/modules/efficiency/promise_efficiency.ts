import { Efficiency } from "./@types/efficiency";
import { EfficiencyService } from "api/Services";
import { get } from 'lodash';

export const promiseCreateEfficiency = async (efficiencyNew: Efficiency) => {
  const response = await EfficiencyService.post(
    {
      ...efficiencyNew,
    },
    false,
    'json',
  );

  const result: Efficiency = {
    ...efficiencyNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateEfficiency = async (efficiency: Efficiency) => {
  const response = await EfficiencyService.put(
    {
      ...efficiency,
    },
    false,
    'json',
  );

  const result: Efficiency = {
    ...efficiency,
    ...get(response, 'result.0', {}),
  };

  return result;
};
