import { FaxogrammsItemsType } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/faxogramms.h';

export type PropsList = {
  items: Array<FaxogrammsItemsType>;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
  classNameContainer?: string;
  addIndex: number;
};
