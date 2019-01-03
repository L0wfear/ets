import {
  CurrentMissionsItemsSubItemsType,
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export interface PropsCollapseListFirstLvl {
  collapsetItems: CurrentMissionsItemsSubItemsType[];
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
}

export interface StateCollapseListFirstLvl {

}
