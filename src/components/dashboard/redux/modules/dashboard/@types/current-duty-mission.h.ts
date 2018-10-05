import {
  RouteType,
} from 'redux/trash-actions/route/@types/promise.h';

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
}

export type CurrentDutyMissionsItemsSubItemsType = {
  data: CurrentDutyMissionsItemsSubItemDatasType,
  tooltip?: string;
  title: string;
};

export type CurrentDutyMissionsItemsType = {
  subItems: CurrentDutyMissionsItemsSubItemsType[],
  tooltip?: string;
  title: string;
}

export type CurrentDutyMissionsAnsType = {
  items: CurrentDutyMissionsItemsType[];
  tooltip?: string;
  title: string;
};

export type CurrentDutyMissionsInfoDataType = RouteType & {
  duty_mission_data: CurrentDutyMissionsItemsSubItemDatasType,
};
