import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

export type PropsMissionFormTitle = {
  IS_CREATING: boolean;
  number: Mission['number'];
  number_text: Mission['number_text'];
  status: Mission['status'];
  column_id: Mission['column_id'];
  MISSION_IS_ORDER_SOURCE: boolean;
};
