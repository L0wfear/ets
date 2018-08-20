import {
  GeozonesService,
} from 'api/Services';

export const loadGeozones = (type, type_geoobject) => ({
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
        const key = `${type_geoobject}/${data.odh_id || data.dt_id || data.global_id || data.id}`;

        try {
          geom.shape = JSON.parse(data.shape_json || data.shape);
        } catch (e) {
          geom.shape = data.shape_json || data.shape;
        }

        return {
          ...newObj,
          [key]: geom,
        }
      }, {}),
    })),
  meta: {
    loading: true,
  },
});