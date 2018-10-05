import { FaxogrammsItemsType } from 'components/dashboard/redux/modules/dashboard/@types/faxogramms.h';

export type PropsList = {
  items: FaxogrammsItemsType[];
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
}
