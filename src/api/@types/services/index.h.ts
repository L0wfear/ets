import { IResponseRowObject, INamedObject } from 'api/@types/rest.h';

export interface IVehicleType extends IResponseRowObject<number> {
  asuods_id: number;
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
