import {
  FutureMissionsItemsByTypeType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/future-mission.h';

export type PropsCollapseList = {
  collapsetItems: FutureMissionsItemsByTypeType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
};
