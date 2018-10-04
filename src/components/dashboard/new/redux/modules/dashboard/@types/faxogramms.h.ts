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
  data: FaxogrammsItemsDataType,
  subItems: FaxogrammsItemsSubItemsType[],
  tooltip?: string;
  title: string;
}

export type FaxogrammsAnsType = {
  items: FaxogrammsItemsType[];
  tooltip?: string;
  title: string;
};

export type FaxogrammsInfoDataType = FaxogrammsItemsType;
