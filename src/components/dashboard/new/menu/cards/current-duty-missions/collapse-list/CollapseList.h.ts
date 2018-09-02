import {
  CurrentDutyMissionsItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/current-duty-mission.h';


export type PropsCollapseList = {
  collapsetItems: CurrentDutyMissionsItemsType[];
  handleClickMission: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
}