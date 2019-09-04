import { IResponseRowObject } from 'api/@types/rest.h';

export interface IVehicle {
  condition_bool: boolean;
  available_to_bind: boolean;
  type_id: number;
  is_trailer: boolean;
  model_id: string | null;
  special_model_name: string;
  asuods_id: number;
  type_name: string;
  owner_name: string;
  type_image_name: string;
  company_structure_id: string;
  garage_number: string;
  fuel_correction_rate: number;
  is_common: boolean;
  gov_number: string;
  model_name: string;
  exploitation_date_start: string;
  note: string;
  parking_address: string;
  car_group_id: number;
  car_group_name: string;
}

export interface IUserNotification extends IResponseRowObject<number> {
  type_id: number;
  is_read: boolean;
  type_name: string;
  title: string;
  type_code: string;
  description: string;
  priority: 'info' | 'warning' | 'alert';
  created_at: string;
  data: {};
  additional_info: string;
  gov_number: string;
}
