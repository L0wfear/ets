export type WaybillDraftItemsSubItemsDataType = {
  waybill_date_create: string;
  waybill_id: number;
};

export type WaybillDraftItemsSubItemsType = {
  data: WaybillDraftItemsSubItemsDataType;
  title: string;
};

export type WaybillDraftItemsType = {
  subItems: Array<WaybillDraftItemsSubItemsType>;
  tooltip?: string;
  value: string;
};

export type WaybillDraftAnsType = {
  items: Array<WaybillDraftItemsType>;
  tooltip?: string;
  title: string;
};

export type WaybillDraftInfoDataType = WaybillDraftItemsType;
