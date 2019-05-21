export type Mission = {
  author: string;
  can_be_closed: boolean;
  can_edit_car_and_route: boolean;
  car_gov_number: string;
  car_gov_numbers: string[];
  car_id: number | null;
  car_ids: number[];
  car_model_name: string,
  car_model_names: string[],
  car_special_model_name: string,
  car_special_model_names: string[],
  car_type_id: number | null;
  car_type_ids: number[];
  car_type_name: string;
  car_type_names: string[];
  column_id: number | null;
  comment: string;
  current_percentage: null
  date_end: string | null;
  date_start: string | null;
  description: string;
  id: number | null;
  is_archive: boolean;
  is_new: boolean;
  is_cleaning_norm?: boolean;
  is_valid_to_order_operation: boolean | null;
  for_column: boolean;
  mission_source_id: number | null;
  mission_source_name: string;
  mission_source_text: string;
  municipal_facility_id: number | null;
  municipal_facility_name: string;
  name: string;
  norm_id: number | null;
  norm_ids: number[];
  norm_text: string;
  number: number | null;
  object_type_id: number | null;
  object_type_name: string;
  operation_num_execution: null
  faxogramm_id?: number; // legacy
  order_id: number | null;
  order_number: string | null;
  order_operation_id: number | null;
  order_status: string;
  passes_count: number | null;
  reason_id: string;
  request_id?: number;
  request_number?: string;
  route_id: number | null;
  route_type: string;
  route_name: string;
  status: string; // @todo
  structure_id: number | null;
  structure_name: string;
  technical_operation_id: number | null;
  technical_operation_name: string;
  type_id: number | null;
  type_name: string;
  waybill_id: number | null;
  waybill_number: number | null;
};

export type GetMissionPayload = {
  id?: number;
  status?: string; // @todo
  date_from?: string | null; // datetime
  date_to?: string | null; // datetime
  car_id?: number;
  technical_operation_id?: number;
  structure_id?: number;
  norm_id?: number;
  municipal_facility_id?: number;
  is_archive?: boolean;
  column_id?: number;

  limit?: number;
  offset?: number;
  sort_by?: string;
  filter?: string; // JSON.stringify(filterValues),
  request_id?: number; //
};
