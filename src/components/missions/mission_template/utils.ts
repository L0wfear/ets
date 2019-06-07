import { makePayloadFromState } from '../mission/MissionForm/utils';
import {
  cloneDeep,
  get,
} from 'lodash';
import { isCrossDates } from 'utils/dates';

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

export const validateMissionsByCheckedElements = (checkedElements: object, noneCheckDate: boolean) => {
  checkedElements = cloneDeep(checkedElements);

  Object.keys(checkedElements).forEach(
    (id) => {
      delete checkedElements[id].front_invalid_interval;
    },
  );

  Object.entries(checkedElements).forEach(
    ([id, data]: any) => {
      Object.entries(checkedElements).forEach(
        ([id2, data2]: any) => {
          if (id !== id2) {
            const triggerOnError = (
              data2.technical_operation_id === data.technical_operation_id
              && data2.municipal_facility_id === data.municipal_facility_id
              && data2.car_ids.toString() === data.car_ids.toString()
              && (noneCheckDate || isCrossDates(data.date_from, data.date_to, data2.date_from, data2.date_to))
            );

            if (triggerOnError) {
              checkedElements[id].front_invalid_interval = true;
              checkedElements[id2].front_invalid_interval = true;
            }
          }
        },
      );
    },
  );

  return checkedElements;
};
