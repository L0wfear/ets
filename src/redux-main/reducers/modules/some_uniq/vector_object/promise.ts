import { get } from 'lodash';

import { VectorObjectService } from 'api/Services';

export const getVectorObject = async (payload: { coordinates: Array<Array<number>>}) => {
  let response = null;

  const badData = (
    payload.coordinates.length < 3
    || payload.coordinates.some((coords_msk) => !coords_msk)
  );

  if (!badData) {
    try {
      response = await VectorObjectService.get(payload);
    } catch (error) {
      // tslint:disable-next-line
      console.warn(error);
    }
  }

  const vObj: Array<{ asuods_id: number; name: string; }> = get(response, 'result') || [];

  return vObj;
};
