import {
  CurrentDutyMissionsItemsSubItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/current-duty-mission.h';

export interface PropsCollapseListFirstLvl {
  collapsetItems: CurrentDutyMissionsItemsSubItemsType[];
  handleClick: (lastSubItem: CurrentDutyMissionsItemsSubItemsType) => any;
  classNameContainer?: string;
  index: number;
}

export interface StateCollapseListFirstLvl {

}
