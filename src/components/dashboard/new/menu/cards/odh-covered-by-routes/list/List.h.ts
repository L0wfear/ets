import { OdhCoveredByRoutesItemsType } from 'components/dashboard/new/redux/modules/dashboard/@types/odh-covered-by-routes.h';

export type PropsList = {
  items: OdhCoveredByRoutesItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
};