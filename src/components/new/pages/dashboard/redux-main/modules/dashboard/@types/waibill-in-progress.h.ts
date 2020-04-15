export type WaybillInProgressItemsSubItemsDataType = {
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

export type WaybillInProgressItemsSubItemsType = ({})
  & WaybillInProgressItemsSubItemsDataType;

export type WaybillInProgressItemsType = {
  subItems: Array<WaybillInProgressItemsSubItemsType>;
  tooltip?: string;
  value: string;
  subItemsTitle: string;
};

export type WaybillInProgressAnsType = {
  items: Array<WaybillInProgressItemsType>;
  tooltip?: string;
  title: string;
};

export type WaybillInProgressInfoDataType = WaybillInProgressItemsType;
