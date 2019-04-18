import {
  CarActualService,
  CarInfoService,
} from 'api/Services';
import { keyBy } from 'lodash';
import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const loadCarActualIndex = (type, data = {}, meta = { loading: true } as TypeMeta) => {
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
