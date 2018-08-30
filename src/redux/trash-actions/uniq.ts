import {
  VectorObjectService,
} from 'api/Services';

import {
  loadCompany,
} from 'redux/trash-actions/uniq/promise';

export const getVectorObject = (type, points) => {
  if (points.length < 3 || points.some(({ coords_msk }) => !coords_msk)) {
    return {
      type,
      payload: Promise.resolve({ vectorObject: [] }),
      meta: {
        loading: true,
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
      loading: true,
    },
  };
}

export const getCompany = (type) => ({
  type,
  payload: loadCompany(),
  meta: {
    loading: true,
  },
});
