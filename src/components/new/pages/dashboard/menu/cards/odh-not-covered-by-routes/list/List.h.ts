import { OdhNotCoveredByRoutesItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-not-covered-by-routes.h';

export type PropsList = {
  items: OdhNotCoveredByRoutesItemsType[];
  handleClick: any;
  classNameContainer?: string;
  addIndex: number;
};
