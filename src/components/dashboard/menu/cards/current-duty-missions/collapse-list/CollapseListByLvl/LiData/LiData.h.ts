import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

export interface PropsLiData {
  subItem: CurrentDutyMissionsItemsSubItemsType;
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => any;
}

export interface StateLiData {

}
