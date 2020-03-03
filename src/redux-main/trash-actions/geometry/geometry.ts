import { get } from 'lodash';
import {
  GormostService,
  GeozonesService,
  FuelEvent,
} from 'api/Services';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

import { GORMOST_GEOOBJECTS_LIST } from 'constants/geoobjects-new';

const CACHE_GEOMETRY = {};

export const loadGeozones: any = (type, type_geoobject, meta = { loading: true }, company_id = null) => {
  const cacheTypeGeoobjectName = `${type_geoobject}${company_id}`;

  if (CACHE_GEOMETRY[type]) {
    if (CACHE_GEOMETRY[type][cacheTypeGeoobjectName]) {
      return ({
        type,
        payload: Promise.resolve(CACHE_GEOMETRY[type][cacheTypeGeoobjectName]),
        meta: {
          ...meta,
        },
      });
    }
  } else {
    CACHE_GEOMETRY[type] = {};
  }
  const payload: any = {};
  if (company_id) {
    payload.company_id = company_id;
  }

  const service = (
    Object.values(GORMOST_GEOOBJECTS_LIST).some(({ serverName }) => serverName === type_geoobject)
      ? GormostService
      : GeozonesService
  );

  return ({
    type,
    payload: service.path(type_geoobject).get(payload)
      .catch((error) => {
        // tslint:disable-next-line
        console.warn(error);

        return {
          result: {
            rows: [],
            error: true,
          },
        };
      })
      .then((response) => {
        const error = get(response, ['result', 'error'], false);
        const rows = get(response, ['result', 'rows'], []);

        if (error) {
          return [];
        }

        return CACHE_GEOMETRY[type][cacheTypeGeoobjectName] = {
          [type_geoobject]: rows.reduce((newObj, data) => {
            const geom = data;
            const front_id = data.odh_id || data.dt_id || data.global_id || data.id;
            const front_key = `${type_geoobject}/${front_id}`;

            try {
              geom.shape = JSON.parse(data.shape_json || data.shape);
            } catch (e) {
              geom.shape = data.shape_json || data.shape;
            }
            geom.front_key = front_key;
            geom.front_id = front_id;

            return {
              ...newObj,
              [front_key]: geom,
            };
          }, {}),
        };
      }),
    meta: {
      ...meta,
    },
  });
};

export const loadFuelEvents = (type, typeEvent, dates) => ({
  type,
  payload: FuelEvent.path(typeEvent)
    .get({
      date_from: createValidDateTime(dates.date_from),
      date_to: createValidDateTime(dates.date_to),
    })
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: {
          rows: [],
        },
      };
    })
    .then(({ result: { rows } }) => ({
      [typeEvent]: rows.reduce((newObj, data, index) => {
        const geom = data;
        const front_key = `${typeEvent}/${index}`;

        geom.shape = {
          ...data.shape,
          coordinates: [...data.shape.coordinates].reverse(),
        };
        geom.front_key = front_key;
        geom.value = Math.abs(Number(geom.value.toFixed(2)));

        return {
          ...newObj,
          [front_key]: geom,
        };
      }, {}),
    })),
  meta: {
    loading: true,
  },
});
