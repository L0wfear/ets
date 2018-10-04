import {
  CarInWorkOverallItemsType,
} from 'components/dashboard/new/redux/modules/dashboard/@types/car-in-work-overall.h';

export type PropsList = {
  items: CarInWorkOverallItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
}