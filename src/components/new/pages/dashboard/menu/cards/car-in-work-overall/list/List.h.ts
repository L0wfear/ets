import {
  CarInWorkOverallItemsType,
} from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/car-in-work-overall.h';

export type PropsList = {
  items: CarInWorkOverallItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
  addIndex: number;
};
