import {
  CurrentDutyMissionsItemsType,
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

export type PropsCollapseListByLvl = {
  collapsetItems: CurrentDutyMissionsItemsType[];
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => any;
  classNameContainer?: string;
};

export interface StateCollapseListByLvl {}
