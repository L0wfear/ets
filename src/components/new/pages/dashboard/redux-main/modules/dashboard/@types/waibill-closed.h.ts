export type WaybillClosedItemsSubItemsDataType = {
  number: number;

  id: number;
  status: string;
  date_create: string;
  car_id: number;
  gov_number: string;
  garage_number: string;
  driver_fio: string;
  driver_phone: string;
  drivers_license: string;
  drivers_license_date_end: string;
  special_license: string;
  special_license_date_end: string;
  mission_statuses: Array<string>;
  missions_completed: Boolean;
  plan_departure_date: string;
  has_missions: Boolean;
};

export type WaybillClosedItemsSubItemsType = ({
}) & WaybillClosedItemsSubItemsDataType;

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
