import {
  CarActualService,
  CarInfoService,
} from 'api/Services';
import { keyBy } from 'lodash';

import {
  LoadCarActualIndexFunc,
} from 'redux-main/trash-actions/car/car.h';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';
import { getCarGpsNumberByDateTime } from 'redux-main/trash-actions/car/promise/promise';

export const loadCarActualIndex: LoadCarActualIndexFunc = (type, data = {}, meta = { loading: true } as TypeMeta) => {
  const payload = {
    ...data,
  };
  return {
    type,
    payload: CarActualService.get(payload)
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
        carActualAsuodsIdIndex: keyBy(rows, 'asuods_id'),
        carActualGpsNumberIndex: keyBy(rows, 'gps_code'),
      })),
    meta: {
      ...meta,
    },
  };
};

export const getCarMissionsByTimestamp = (type, car_id, point_timestamp, meta = { loading: true } as TypeMeta) => {
  const payload = {
    car_id,
    point_timestamp,
  };

  return {
    type,
    payload: CarInfoService.get(payload)
      .catch((error) => {
        // tslint:disable-next-line
        console.warn(error);

        return {
          result: {
            missions: [],
          },
        };
      })
      .then(({ result: { missions: missionsByTimestamp } }) => ({ missionsByTimestamp })),
    meta: {
      ...meta,
    },
  };
};

export const loadCarGpsCode = (type, { asuods_id, date_start}, { page, path}) => ({
  type,
  payload: getCarGpsNumberByDateTime({ asuods_id, date_start }),
  meta: {
    promise: true,
    page,
    path,
  },
});
