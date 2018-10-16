import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export interface PropsLiData {
  subItem: CurrentMissionsItemsSubItemsSubItemsType;
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
}

export interface StateLiData {

}
