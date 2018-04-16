import { IResponseRowObject, INamedObject } from 'api/@types/rest.h';

export interface IVehicleType extends IResponseRowObject<number> {
  asuods_id: number;
  type_id: number;
  full_name: string;
  gov_number: string;
  is_trailer: boolean;
  is_common: boolean;
  plow_width_dt: number;
  plow_width_odh: number;
  season_id: number;
  season_name: string;
  short_name: string;
  model_name: string;
  special_model_name: string;
  speed_limit: number;
  company_structure_id: string;
}

export interface IVehicle {
  type_id: number;
  is_trailer: boolean;
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
}

export interface IVehicleRegister {
  register_certificate_number: string;
  register_given_by: string;
  register_given_at: Date;
  register_note: string;
}

export interface IVehiclePassport  extends IVehiclePassportGibdd, IVehiclePassportGtn {
  passport_type: string;
}

export interface IVehiclePassportGibdd {
  passport_gibdd_seria_number: string;
  passport_gibdd_vin: number;
  passport_gibdd_func_type_id: number;
  passport_gibdd_category_id: number;
  passport_gibdd_body_number: string;
  passport_gibdd_body_color: string;
  passport_gibdd_manufactured_at: number;
  passport_gibdd_engine_model: string;
  passport_gibdd_engine_number: string;
  passport_gibdd_engine_power: number;
  passport_gibdd_engine_volumne: number;
  passport_gibdd_engine_type_id: number;
  passport_gibdd_chassis: string;
  passport_gibdd_max_weight: number;
  passport_gibdd_empty_weight: number;
  passport_gibdd_environmental_class: number;
  passport_gibdd_origin_country_id: number;
  passport_gibdd_exporter_country_id: number;
  passport_gibdd_customs_restrictions: string;
  passport_gibdd_customs_declaration: string;
  passport_gibdd_address: string;
  passport_gibdd_company_address: string;
  passport_gibdd_given_at: string;
  passport_gibdd_files: any;
}

export interface IVehiclePassportGtn {
  passport_gtn_number: string;
  passport_gtn_address: string;
  passport_gtn_given_by: string;
  passport_gtn_manufactured_at: number;
  passport_gtn_engine_power: number;
  passport_gtn_empty_weight: number;
  passport_gtn_gearbox: string;
  passport_gtn_propulsion_type_id: number;
  passport_gtn_dimensions: string;
  passport_gtn_manufacturer: string;
  passport_gtn_conformity_certificate: string;
  passport_gtn_tech_inspection_certificate: string;
  passport_gtn_engine_number: string;
  passport_gtn_body_color: string;
  passport_gtn_body_number: string;
  passport_gtn_axle_number: string;
  passport_gtn_max_speed: number;
  passport_gtn_files: any;
}

export interface ITechnicalOperationType extends IResponseRowObject<number> {
  check_type: string;
  check_type_name: string;
  max_speed: number;
  name: string;
  needs_brigade: boolean;
  object_name: string;
  objects: INamedObject;
  season_id: number;
  season_name: string;
  use_in_reports: boolean;
  work_kind_id: number;
  work_kind_name: string;
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
}

  // "defaults": {
  //   "FUEL_TYPE": "DT"
  // },
  // "summer_end": [
  //   10,
  //   31
  // ],
  // "summer_start": [
  //   4,
  //   15
  // ],
  // "enums": {
  //   "FUEL_TYPE": {
  //     "A80": "А-80",
  //     "AI95": "АИ-95",
  //     "DT": "ДТ",
  //     "AI92": "АИ-92"
  //   }
  // }

export interface IAppConfig {
  defaults: ETSCore.Types.IStringKeyHashTable<string>;
  enums: ETSCore.Types.IStringKeyHashTable<string>;
  summer_start: [
    /*month*/number,
    /*day*/number
  ];
  summer_end: [
    /*month*/number,
    /*day*/number
  ];
}
