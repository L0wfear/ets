import {
  CurrentMissionsItemsType,
} from 'components/dashboard/new/redux-main/modules/dashboard/@types/current-mission.h';

export type PropsCollapseList = {
  collapsetItems: CurrentMissionsItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
}