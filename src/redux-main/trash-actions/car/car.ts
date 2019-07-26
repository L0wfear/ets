import {
  CarInfoService,
} from 'api/Services';

import { TypeMeta } from 'redux-main/trash-actions/@types/common.h';

export const getCarMissionsByTimestamp: any = (car_id, point_timestamp, meta = { loading: true } as TypeMeta) => (dispatch) => {
  const payload = {
    car_id,
    point_timestamp,
  };

  return dispatch({
    type: '',
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
  });
};
