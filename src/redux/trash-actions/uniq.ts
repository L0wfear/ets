import {
  VectorObjectService,
} from 'api/Services';

import {
  loadCompany,
} from 'redux/trash-actions/uniq/promise';
import { TypeMeta } from 'redux/trash-actions/@types/common.h';

export const getVectorObject = (type, points, meta = { loading: true } as TypeMeta) => {
  if (points.length < 3 || points.some(({ coords_msk }) => !coords_msk)) {
    return {
      type,
      payload: Promise.resolve({ vectorObject: [] }),
      meta: {
        ...meta,
      },
    }
  }

  const payload = {
    coordinates: points.map(({ coords_msk }) => coords_msk),
  };

  return {
    type,
    payload: VectorObjectService.get(payload)
      .catch((error) => {
        console.warn(error);

        return {
          result: [],
        };
      })
      .then(({ result }) => ({
        vectorObject: result,
      })),
    meta: {
      ...meta,
    },
  };
}

export const getCompany = (type, meta = { loading: true } as TypeMeta) => ({
  type,
  payload: loadCompany(),
  meta: {
    ...meta,
  },
});
