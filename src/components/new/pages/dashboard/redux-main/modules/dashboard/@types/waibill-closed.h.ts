export type WaybillClosedItemsSubItemsDataType = {
  car_garage_number: string | void;
  car_gov_number: string;
  driver_fio: string;
  waybill_id: number;
  waybill_number: number;
};

export type WaybillClosedItemsSubItemsType = {
  data: WaybillClosedItemsSubItemsDataType;
};

export type WaybillClosedItemsType = {
  subItems: Array<WaybillClosedItemsSubItemsType>;
  tooltip?: string;
  value: string;
};

export type WaybillClosedAnsType = {
  items: Array<WaybillClosedItemsType>;
  tooltip?: string;
  title: string;
};

export type WaybillClosedInfoDataType = WaybillClosedItemsType;
