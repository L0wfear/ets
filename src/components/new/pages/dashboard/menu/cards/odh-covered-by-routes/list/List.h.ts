import { OdhCoveredByRoutesItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/odh-covered-by-routes.h';

export type PropsList = {
  items: OdhCoveredByRoutesItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
  addIndex: number;
};
