export type OneCarData = {
  asuods_id: number;
  available: boolean;
  available_to_bind: boolean;
  body_capacity: number | void;
  car_group_id: number | void;
  car_group_name: string | void;
  company_id: number | void;
  company_name: string | void;
  company_structure_id: number | void;
  company_structure_name: string | void;
  condition: number | void;
  condition_bool: boolean;
  condition_text: string | void;
  equipment_sensors_str: string | void;
  equipment_sensors_types_ids: number[] | void;
  exploitation_date_start: any;
  for_driver_license: boolean;
  for_special_license: boolean;
  fuel_correction_rate: number | void;
  full_model_name: string | void;
  garage_number: string | void;
  gov_number: string;
  gps_code: string;
  is_common: boolean;
  is_trailer: boolean;
  level_sensors_num: number | void;
  load_capacity: number | void;
  max_speed: number | void;
  model_id: number | void;
  model_name: string | void;
  note: string | void;
  okrug_id: number | void;
  okrug_name: string | void;
  owner_id: number | void;
  owner_name: string | void;
  parking_address: string | void;
  season: number | void;
  season_label: number | void;
  season_name: string | void;
  special_model_id: number | void;
  special_model_name: string | void;
  type_id: number | void;
  type_image_name: string | void;
  type_name: string | void;
};

export type CarActualAsuodsIdIndexType = {
  [asuods_id: string]: OneCarData,
};

export type CarActualGpsNumberIndexType = {
  [gps_code: string]: OneCarData,
};

export type LoadCarActualIndexPromise = {
  carActualAsuodsIdIndex: CarActualAsuodsIdIndexType;
  carActualGpsNumberIndex: CarActualGpsNumberIndexType;
};

type LoadCarActualIndexFuncPropsData = any;

export type LoadCarActualIndexFunc = (
  type: string,
  data: LoadCarActualIndexFuncPropsData,
) => {
  type: string,
  payload: Promise<LoadCarActualIndexPromise>
  meta: {
    loading: boolean,
  };
};
