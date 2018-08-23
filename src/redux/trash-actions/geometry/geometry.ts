import {
  GeozonesService,
} from 'api/Services';

import { loadGeozonesFunc } from 'redux/trash-actions/geometry/geometry.h';

export const loadGeozones: loadGeozonesFunc = (type, type_geoobject) => ({
  type,
  payload: GeozonesService.path(type_geoobject).get()
    .catch((error) => {
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    })
    .then(({ result: { rows } }) => ({
      [type_geoobject]: rows.reduce((newObj, data) => {
        const geom = data;
        const front_key = `${type_geoobject}/${data.odh_id || data.dt_id || data.global_id || data.id}`;

        try {
          geom.shape = JSON.parse(data.shape_json || data.shape);
        } catch (e) {
          geom.shape = data.shape_json || data.shape;
        }
        geom.front_key = front_key;

        return {
          ...newObj,
          [front_key]: geom,
        }
      }, {}),
    })),
  meta: {
    loading: true,
  },
});