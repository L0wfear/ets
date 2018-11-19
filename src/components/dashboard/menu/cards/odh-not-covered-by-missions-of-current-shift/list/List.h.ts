import { OdhNotCoveredByMissionsOfCurrentShiftItemsType } from 'components/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-missions-of-current-shift.h';

export type PropsList = {
  items: OdhNotCoveredByMissionsOfCurrentShiftItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
  addIndex: number;
};
