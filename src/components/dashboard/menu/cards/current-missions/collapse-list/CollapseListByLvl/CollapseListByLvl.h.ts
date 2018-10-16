import {
  CurrentMissionsItemsType,
  CurrentMissionsItemsSubItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-mission.h';

export type PropsCollapseListByLvl = {
  collapsetItems: CurrentMissionsItemsType[];
  handleClick: (lastSubItem: CurrentMissionsItemsSubItemsSubItemsType) => any;
  classNameContainer?: string;
}

export interface StateCollapseListByLvl {};
