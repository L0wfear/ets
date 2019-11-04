export type WaybillInProgressItemsSubItemsDataType = {
  car_garage_number: string | void;
  car_gov_number: string;
  create_date: string;
  driver_fio: string;
  driver_phone: string | void;
  waybill_id: number;
  waybill_number: number;
};

export type WaybillInProgressItemsSubItemsType = {
  data: WaybillInProgressItemsSubItemsDataType;
};

export type WaybillInProgressItemsType = {
  subItems: Array<WaybillInProgressItemsSubItemsType>;
  tooltip?: string;
  value: string;
};

export type WaybillInProgressAnsType = {
  items: Array<WaybillInProgressItemsType>;
  tooltip?: string;
  title: string;
};

export type WaybillInProgressInfoDataType = WaybillInProgressItemsType;
