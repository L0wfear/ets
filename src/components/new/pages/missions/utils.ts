import {
  cloneDeep,
} from 'lodash';
import { isCrossDates } from 'utils/dates';

import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export const isOrderSource = (
  (
    mission_source_id: DutyMission['mission_source_id'] | Mission['mission_source_id'],
    order_mission_source_id: number,
  ) => (
    mission_source_id === order_mission_source_id
  )
);

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
