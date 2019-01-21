import { makePayloadFromState } from '../mission/MissionForm/utils';
import {
  get,
} from 'lodash';

export const getNormByMissionAndCar = async (getCleaningOneNorm, carsIndex, missionArr: any[]) => {
  const ans = await Promise.all(
    missionArr.map(async (missionData: any) => {
      const carIdNormIdArray = await Promise.all(
        missionData.car_ids.map(async (car_id) => {
          const normData = await getCleaningOneNorm({
            ...makePayloadFromState(missionData, get(carsIndex, [car_id, 'type_id'], null)),
          });

          return {
            car_id,
            norm_id: normData.norm_id,
          };
        }),
      );

      return {
        id: missionData.id,
        normByCarId: carIdNormIdArray.reduce((newObj: any, { car_id, norm_id }: any) => {
          newObj[car_id] = norm_id;

          return newObj;
        }, {}),
      };
    }),
  );

  return ans.reduce((newObj: any, { id, normByCarId }) => {
    newObj[id] = normByCarId;

    return newObj;
  }, {});
};
