export type FaxogrammsItemsDataType = {
  id: number;
  order_date: string;
  order_date_to: string;
  order_info: string | void;
};

export type FaxogrammsItemsSubItemsType = {
  title: string;
};

export type FaxogrammsItemsType = {
  data: FaxogrammsItemsDataType;
  subItems: Array<FaxogrammsItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type FaxogrammsAnsMetaType = {
  date_from: string | void;
  date_to: string | void;
};

export type FaxogrammsAnsType = {
  items: Array<FaxogrammsItemsType>;
  tooltip?: string;
  title: string;
  meta: FaxogrammsAnsMetaType;
};

export type FaxogrammsInfoDataType = FaxogrammsItemsType;
