import {
  CurrentDutyMissionsItemsType,
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

export type PropsCollapseListByLvl = {
  collapsetItems: CurrentDutyMissionsItemsType[];
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => any;
  classNameContainer?: string;
}

export interface StateCollapseListByLvl {};
