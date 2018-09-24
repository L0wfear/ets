import {
  FutureMissionsItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/future-mission.h';

export type PropsList = {
  items: FutureMissionsItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
}
