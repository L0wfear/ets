import { Route } from 'redux-main/reducers/modules/routes/@types';

export type OrderTechnicalOperation = {
  change_status: string | null;
  date_from: string | null;
  date_to: string | null;
  elem: string;
  id: number;
  municipal_facility_id: number;
  norm_id: number;
  num_exec: number;
  object_type_name: string;
  order_operation_id: number;
  route_types: Route['type']
  tk_operation_name: string;
  work_type_name: string;
};

export type Order = {
  create_date: string;
  id: number;
  instruction: string;
  order_date: string;
  order_date_to: string;
  order_info: string | null;
  order_number: string;
  order_type_id: number;
  order_type_name: string;
  pgm: any;
  status: string; // @todo status list
  status_name: string; // @todo status list
  synced_timestamp: string;
  technical_operations: OrderTechnicalOperation[];
};
