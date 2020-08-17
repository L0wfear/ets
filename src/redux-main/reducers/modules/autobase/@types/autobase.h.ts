import { FuelCard, FuelType } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { ActualBatteriesOnCar } from '../actions_by_type/actual_batteries_on_car/@types';
import { ActualTiresOnCar } from '../actions_by_type/actual_tires_on_car/@types';

export type SparePart = {
  company_id?: number;
  company_name?: string;
  group_name?: string;
  id: number;
  measure_unit_id: number;
  measure_unit_name?: string;
  name: string;
  number: string;
  okrug_name: string;
  quantity: number;
  spare_part_group_id: number;
  supplied_at: string;
  spare_part_to_car: any;
  installed_at?: string;
  count_part?: any;
};

export type MeasureUnit = {
  id: number;
  name: string;
};

export type SparePartGroup = {
  id: number;
  name: string;
};

export type BatteryBrand = {
  id: number;
  name: string;
  manufacturer_id: number;
  manufacturer_name: string;
};
export type BatteryManufacturer = {
  id: number;
  name: string;
};
export type BatteryOnCar = {
  car_id: number;
  gov_number?: string;
  id?: number;
  installed_at: string;
  uninstalled_at: string;
  // для таблички
  customId?: number;
  isChecked?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  odometr_start?: any;
};

export type BatteryRegistry = {
  battery_to_car: Array<BatteryOnCar>;
  battery_to_car_id: number;
  brand_id: number;
  brand_name: string;
  car_id: number;
  company_id: number;
  company_name: string;
  gov_number: string;
  id: number;
  installed_at: string;
  lifetime_months: number;
  manufacturer_id: number;
  manufacturer_name: string;
  odometr_start: string;
  okrug_name: string;
  released_at: string;
  serial_number: string;
  uninstalled_at: string;
  worked_months: number;
  status_text: string;
  status: string;
  company_structure_name: string;
};

export type BatteryAvailableCar = {
  id: number;
  name: string;
};

export type InsurancePolicy = {
  car_id: number;
  company_id: number;
  company_name: string;
  company_short_name: string;
  created_at: string;
  date_end: string;
  date_start: string;
  gov_number: string;
  gov_numbers_text: string;
  gov_numbers: Array<any>;
  id: number;
  insurance_type_id: number;
  insurance_type_name: string;
  insurer: string;
  note: string;
  number: string;
  okrug_name: string;
  price: number;
  seria: string;
  updated_at: string;
  files: Array<any>;
};

export type InsuranceType = {
  id: number;
  name: string;
};

export type Car = {
  asuods_id: number;
  available: boolean;
  available_to_bind: boolean;
  body_capacity: number;
  car_group_id: number;
  car_group_name: string;
  certificate_number: string;
  company_id: number;
  company_name: string;
  company_name_customer: string;
  company_name_contractor: string;
  company_structure_id: number;
  company_structure_name: string;
  condition: number;
  condition_bool: boolean;
  condition_text: string;
  equipment_sensors_str: string;
  equipment_sensors_types_ids: Array<number>;
  exploitation_date_start: string;
  factory_number: string;
  for_driver_license: boolean;
  for_special_license: boolean;
  fuel_correction_rate: number;
  full_model_name: string;
  garage_number: string;
  gov_number: string;
  gps_code: string;
  is_common: boolean;
  is_gibdd_passport: boolean;
  is_gtn_passport: boolean;
  is_gims_passport: boolean;
  is_trailer: boolean;
  level_sensors_num: number;
  load_capacity: number;
  max_speed: number;
  model_id: number;
  model_name: string;
  note: string;
  okrug_id: number;
  okrug_name: string;
  operating_mode: string;
  owner_id: number;
  owner_name: string;
  parking_address: string;
  passport_number: string;
  season: number;
  season_label: number;
  season_name: string;
  special_model_id: number;
  special_model_name: string;
  type_id: number;
  type_image_name: string;
  type_name: string;
  vin: string;
  engine_kind_ids: Array<Number>;
};

export type CarFuncTypes = {
  asuods_id: number;
  avg_work_hours: number;
  full_name: string;
  group_id: number;
  group_name: string;
  short_name: string;
};

export type Repair = {
  can_edit: boolean;
  car_id: number;
  company_id: number;
  company_name: string;
  company_short_name: string;
  description: string;
  fact_date_end: string;
  fact_date_start: string;
  files: Array<any>;
  gov_number: string;
  id: number;
  note: string;
  number: string;
  plan_date_end: string;
  plan_date_start: string;
  repair_company_id: number;
  repair_company_name: string;
  repair_type_id: string;
  repair_type_name: string;
  status: string;
};

export type RepairCompany = {
  comment: string;
  company_id: number;
  company_name: string;
  company_short_name: string;
  okrug_name: string;
  id: number;
  name: string;
};
export type RepairType = {
  id: number;
  name: string;
};
export type RoadAccident = {
  accident_date: string;
  accident_place: string;
  car_gov_number: string;
  car_id: number;
  cause_id: number;
  cause_name: string;
  comment: string;
  company_id: number;
  company_name: string;
  company_short_name: string;
  created_at: string;
  damage_price: number;
  driver_fio: string;
  driver_id: number;
  drivers_license: null;
  employee_position_name: string;
  files: Array<any>;
  id: number;
  is_guilty: boolean;
  special_license: string;
  updated_at: string;
};
export type RoadAccidentCause = {
  id: number;
  name: string;
};
export type TechInspection = {
  car_id: number;
  company_id: number;
  company_name: string;
  company_short_name: string;
  created_at: string;
  date_end: string;
  date_start: string;
  gov_number: string;
  gov_numbers_text: string;
  gov_numbers: Array<any>;
  id: number;
  is_allowed: boolean;
  note: string;
  okrug_name: string;
  reg_number: string;
  tech_operator: string;
  updated_at: string;
  files?: Array<any>;
};
export type TechMaintOrder = {
  car_model_id: number;
  car_model_name: string;
  company_id: number;
  company_name: string;
  description: string;
  entity_name: string;
  id: number;
  interval_probeg: number;
  interval_time: number;
  interval_time_type: number;
  is_periodic: boolean;
  measure_unit_run_id: number;
  measure_unit_run_name: string;
  okrug_name: string;
  sequence: number;
  tech_maintenance_type_id: number;
  tech_maintenance_type_name: string;
  files?: Array<any>;
};

export type TechMaintType = {
  id: number;
  name: string;
};
export type MeasureUnitRun = {
  id: number;
  name: string;
  tech_maintenance_type_id: number;
  tech_maintenance_type_name: string;
};
export type TireModel = {
  id: number;
  name: string;
  tire_manufacturer_id: number;
  tire_manufacturer_name: string;
};
export type TireManufacturer = {
  id: number;
  name: string;
};

export type TireOnCar =   {
  car_id: number;
  gov_number: string;
  id?: number;
  installed_at: string;
  motohours_diff: number;
  odometr_diff: number;
  uninstalled_at: string;
  sum_track_length: number;
  // для таблички
  customId?: number;
  isChecked?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
};

export type Tire = {
  car_id: number;
  comment: string;
  company_id: number;
  company_name: string;
  gov_number: string;
  id?: number;
  initial_mileage: number;
  installed_at: string;
  motohours_diff: number;
  odometr_diff: number;
  okrug_name: string;
  tire_manufacturer_id: number;
  tire_manufacturer_name: string;
  tire_model_id: number;
  tire_model_name: string;
  tire_size_id: number;
  tire_size_name: string;
  tire_to_car: Array<TireOnCar>;
  tire_to_car_id: number;
  uninstalled_at: string;
  status_text: string;
  status: string;
  sum_track_length: number;
  sum_track_length_km: number;
  company_structure_name: string;
};
export type TireSize = {
  id: number;
  name: string;
};
export type TireAvailableCar = {
  car_id: number;
  gov_number: string;
};
export type SpareAvailableCar = {
  car_id: number;
  gov_number: string;
};

export type TechMaintenance = {
  can_edit: boolean;
  car_id: number;
  company_id: number;
  company_name: number;
  company_short_name: number;
  fact_date_end: string;
  fact_date_start: string;
  gov_number: number;
  id: number;
  motohours_fact: number;
  note: string;
  number: number | string;
  odometr_fact: number;
  plan_date_end: string;
  plan_date_start: string;
  repair_company_id: number;
  repair_company_name: string;
  tech_maintenance_order_ids: Array<number>;
  tech_maintenance_orders: Array<{
    car_model_id: number;
    car_model_name: string;
    description: string;
    entity_name: string;
    id: number;
    interval_probeg: number;
    interval_time: number;
    interval_time_type: string;
    is_periodic: boolean;
    measure_unit_run_id: number;
    measure_unit_run_name: string;
    sequence: number;
    tech_maintenance_type_id: number;
    tech_maintenance_type_name: string;
  }>;
  tech_maintenance_orders_text: string;
  files: Array<any>;
};
export type TechMaintenanceExtra = {
  car_interval_probeg: number;
  car_interval_time: number;
};

export type CarCategory = {
  id: number;
  name: string;
};
export type EngineType = {
  id: number;
  name: string;
};
export type PropulsionType = {
  id: number;
  name: string;
};

export type TypesAttr = {
  car_func_type_id: number;
  data_rate: number;
  end_date: string;
  equip_width: number;
  full_name: string;
  id: number;
  is_check_gov_number: number;
  mkad_speed_lim: number;
  object_type_id: number;
  object_type_name: string;
  oper_type_id: number;
  oper_type_name: string;
  parent_id: number;
  route_type: string;
  season_id: number;
  season_name: string;
  short_name: string;
  speed_lim: number;
  work_class_code: string;
  work_class_id: number;
  work_class_name: string;
  work_class_short_name: string;
};

export type IStateAutobase = {
  sparePartList: Array<SparePart>;
  measureUnitList: Array<MeasureUnit>;
  sparePartGroupList: Array<SparePartGroup>;
  batteryBrandList: Array<BatteryBrand>;
  batteryManufacturerList: Array<BatteryManufacturer>;
  batteryRegistryList: Array<BatteryRegistry>;
  batteryAvailableCarList: Array<BatteryAvailableCar>;
  insuranceTypeList: Array<InsuranceType>;
  insurancePolicyList: Array<InsurancePolicy>;
  carList: Array<Car>;
  carIndex: Record<Car['asuods_id'], Car>;
  carFuncTypesList: Array<CarFuncTypes>;
  repairList: Array<Repair>;
  repairCompanyList: Array<RepairCompany>;
  repairTypeList: Array<RepairType>;
  roadAccidentList: Array<RoadAccident>;
  roadAccidentCauseList: Array<RoadAccidentCause>;
  techInspectionList: Array<TechInspection>;
  techMaintOrderList: Array<TechMaintOrder>;
  techMaintTypeList: Array<TechMaintType>;
  measureUnitRunList: Array<MeasureUnitRun>;
  tireModelList: Array<TireModel>;
  tireManufacturerList: Array<TireManufacturer>;
  tireList: Array<Tire>;
  tireSizeList: Array<TireSize>;
  tireAvailableCarList: Array<TireAvailableCar>;
  spareAvailableCarList: Array<SpareAvailableCar>;
  actualBatteriesOnCarList: Array<ActualBatteriesOnCar>;
  actualTiresOnCarList: Array<ActualTiresOnCar>;
  techMaintList: Array<TechMaintenance>;
  techMaintExtra: TechMaintenanceExtra;
  carCategoryList: Array<CarCategory>;
  engineTypeList: Array<EngineType>;
  propulsionTypeList: Array<PropulsionType>;
  fuelCardsList: Array<FuelCard>;
  fuelTypeList: Array<FuelType>;
  typesAttrList: Array<TypesAttr>;
  equipmentFuelCardsList: Array<FuelCard>;
  notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>;
};
