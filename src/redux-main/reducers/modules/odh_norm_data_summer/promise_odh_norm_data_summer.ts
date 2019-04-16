import { OdhNormDataSummer } from "./@types/odhNormDataSummer";
import { OdhNormDataSummerService } from "api/Services";
import { get } from 'lodash';

export const promiseCreateOdhNormDataSummer = async (odhNormDataSummerNew: OdhNormDataSummer) => {
  const response = await OdhNormDataSummerService.post(
    {
      ...odhNormDataSummerNew,
    },
    false,
    'json',
  );

  const result: OdhNormDataSummer = {
    ...odhNormDataSummerNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateOdhNormDataSummer = async (odhNormDataSummer: OdhNormDataSummer) => {
  const response = await OdhNormDataSummerService.put(
    {
      ...odhNormDataSummer,
    },
    false,
    'json',
  );

  const result: OdhNormDataSummer = {
    ...odhNormDataSummer,
    ...get(response, 'result.0', {}),
  };

  return result;
};
