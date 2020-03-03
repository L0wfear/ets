export type WaybillCompletedItemsSubItemsDataType = {
  car_garage_number: string | void;
  car_gov_number: string;
  create_date: string;
  driver_fio: string;
  driver_phone: string | void;
  waybill_id: number;
  waybill_number: number;
};

export type WaybillCompletedItemsSubItemsType = {
  data: WaybillCompletedItemsSubItemsDataType;
  title?: string;
};

export type WaybillCompletedItemsType = {
  subItems: Array<WaybillCompletedItemsSubItemsType>;
  subItemsTitle?: string;
  tooltip?: string;
  value: string;
};

export type WaybillCompletedAnsType = {
  items: Array<WaybillCompletedItemsType>;
  tooltip?: string;
  title: string;
};

export type WaybillCompletedInfoDataType = WaybillCompletedItemsType;
