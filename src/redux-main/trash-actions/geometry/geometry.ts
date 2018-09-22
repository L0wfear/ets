import {
  GeozonesService,
  FuelEvent,
} from 'api/Services';
import { createValidDateTime } from 'utils/dates';

import { loadGeozonesFunc } from 'redux-main/trash-actions/geometry/geometry.h';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const loadGeozones: loadGeozonesFunc = (type, type_geoobject, meta = { loading: true } as TypeMeta) => ({
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
    ...meta,
  },
});

export const loadFuelEvents = (type, typeEvent, dates) => ({
  type,
  payload: FuelEvent.path(typeEvent)
    .get({
      date_from: createValidDateTime(dates.date_from),
      date_to: createValidDateTime(dates.date_to),
    })
    .catch((error) => {
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