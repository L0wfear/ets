import {
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export interface PropsCollapseListSecondLvl {
  collapsetItems: CurrentMissionsItemsSubItemsSubItemsType[];
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
}

export interface StateCollapseListSecondLvl {

}
