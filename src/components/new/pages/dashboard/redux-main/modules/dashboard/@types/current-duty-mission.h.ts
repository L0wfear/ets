import { Route } from 'redux-main/reducers/modules/routes/@types';

export type CurrentDutyMissionsItemsSubItemDatasType = {
  duty_mission_date_end: string;
  duty_mission_date_start: string;
  duty_mission_id: number;
  duty_mission_number: number;
  duty_mission_route_id: number;
  foreman_fio: string;
  foreman_phone: string | void;
  object_type_name: string;
  technical_operation_id: number;
  technical_operation_name: string;
};

export type CurrentDutyMissionsItemsSubItemsSubItemsType = {
  data: CurrentDutyMissionsItemsSubItemDatasType;
  tooltip?: string;
  title: string;
};

export type CurrentDutyMissionsItemsSubItemsType = {
  subItems: Array<CurrentDutyMissionsItemsSubItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type CurrentDutyMissionsItemsType = {
  subItems: Array<CurrentDutyMissionsItemsSubItemsType>;
  tooltip?: string;
  title: string;
};

export type CurrentDutyMissionsAnsType = {
  tooltip?: string;
  items: Array<CurrentDutyMissionsItemsType>;
  items_centralized: Array<CurrentDutyMissionsItemsType>;
  items_decentralized: Array<CurrentDutyMissionsItemsType>;
  title: string;
  title_centralized: string;
  title_decentralized: string;
};

export type CurrentDutyMissionsInfoDataType = Route & {
  duty_mission_data: CurrentDutyMissionsItemsSubItemDatasType;
};
