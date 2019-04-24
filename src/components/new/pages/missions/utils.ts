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
