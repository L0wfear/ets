import {
  CarService,
  CarInfoService,
} from 'api/Services';
import { keyBy } from 'lodash';

import {
  LoadCarActualIndexFunc,
} from 'redux/trash-actions/car/car.h';

export const loadCarActualIndex: LoadCarActualIndexFunc = (type, data = {}) => {
  const payload = {
    ...data,
  };
  return {
    type,
    payload: CarService.get(payload)
      .catch((error) => {
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
      loading: true,
    },
  };
};


export const getCarMissionsByTimestamp = (type, car_id, point_timestamp) => {
  const payload = {
    car_id,
    point_timestamp,
  };

  return {
    type,
    payload: CarInfoService.get(payload)
      .catch((error) => {
        console.warn(error);

        return {
          result: {
            missions: [],
          },
        };
      })
      .then(({ result: { missions: missionsByTimestamp } }) => ({ missionsByTimestamp })),
    meta: {
      loading: true,
    },
  };
};