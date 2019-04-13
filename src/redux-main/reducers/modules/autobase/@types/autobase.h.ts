import { FuelCards, FuelType } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export type SparePart = {
  company_id?: number | null;
  company_name?: string | null;
  group_name?: string | null;
  id: number | null;
  measure_unit_id: number | null;
  measure_unit_name?: string | null;
  name: string | null;
  number: string | null;
  quantity: number | null;
  spare_part_group_id: number | null;
  supplied_at: string | null;
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
  id?: number | null;
  name: string | null;
  manufacturer_id: number | null;
  manufacturer_name: string | null;
};
export type BatteryManufacturer = {
  id: number | null;
  name: string | null;
};
export type BatteryOnCar = {
  car_id: number | null;
  gov_number: string | null;
  id: number | null;
  installed_at: string | null;
  uninstalled_at: string | null;
};

export type BatteryRegistry = {
  battery_to_car: BatteryOnCar[];
  battery_to_car_id: number | null;
  brand_id: number | null;
  brand_name: string | null;
  car_id: number | null;
  company_id: number | null;
  company_name: string | null;
  gov_number: string | null;
  id: number | null;
  installed_at: string | null;
  lifetime_months: number | null;
  manufacturer_id: number | null;
  manufacturer_name: string | null;
  odometr_start: string | null;
  released_at: string | null;
  serial_number: string | null;
  uninstalled_at: string | null;
  worked_months: number | null;
};

export type BatteryAvailableCar = {
  id: number;
  name: string;
};

export type InsurancePolicy = {
  car_id: number | null;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  created_at: string | null;
  date_end: string | null;
  date_start: string | null;
  gov_number: string | null;
  id: number | null;
  insurance_type_id: number | null;
  insurance_type_name: string | null;
  insurer: string | null;
  note: string | null;
  number: string | null;
  price: number | null;
  seria: string | null;
  updated_at: string | null;
  files: any[];
};

export type InsuranceType = {
  id: number | null;
  name: string | null;
};

export type Car = {
  asuods_id: number | null;
  available: boolean;
  available_to_bind: boolean;
  body_capacity: number | null;
  car_group_id: number | null;
  car_group_name: string;
  company_id: number | null;
  company_name: string;
  company_structure_id: number | null;
  company_structure_name: string | null;
  condition: number | null;
  condition_bool: boolean;
  condition_text: string;
  equipment_sensors_str: string;
  equipment_sensors_types_ids: number[];
  exploitation_date_start: string | null;
  for_driver_license: boolean;
  for_special_license: boolean;
  fuel_correction_rate: number | null;
  full_model_name: string;
  garage_number: string;
  gov_number: string;
  gps_code: string;
  is_common: boolean;
  is_trailer: boolean;
  level_sensors_num: number | null;
  load_capacity: number | null;
  max_speed: number | null;
  model_id: number | null;
  model_name: string;
  note: string;
  okrug_id: number | null;
  okrug_name: string;
  owner_id: number | null;
  owner_name: string;
  parking_address: string;
  season: number | null;
  season_label: number | null;
  season_name: string;
  special_model_id: number | null;
  special_model_name: string;
  type_id: number | null;
  type_image_name: string;
  type_name: string;
};

export type CarFuncTypes = {
  asuods_id: number | null;
  avg_work_hours: number | null;
  full_name: string | null;
  group_id: number | null;
  group_name: string | null;
  short_name: string | null;
};

export type Repair = {
  can_edit: boolean;
  car_id: number | null;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  description: string | null;
  fact_date_end: string | null;
  fact_date_start: string | null;
  files: any[];
  gov_number: string | null;
  id: number | null;
  note: string | null;
  number: string | null;
  plan_date_end: string | null;
  plan_date_start: string | null;
  repair_company_id: number | null;
  repair_company_name: string | null;
  repair_type_id: string | null;
  repair_type_name: string | null;
  status: string | null;
};

export type RepairCompany = {
  comment: string | null;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  id: number | null;
  name: string | null;
};
export type RepairType = {
  id: number | null;
  name: string | null;
};
export type RoadAccident = {
  accident_date: string | null;
  accident_place: string | null;
  car_gov_number: string | null;
  car_id: number | null;
  cause_id: number | null;
  cause_name: string | null;
  comment: string | null;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  created_at: string | null;
  damage_price: number | null;
  driver_fio: string | null;
  driver_id: number | null;
  drivers_license: null
  employee_position_name: string | null;
  files: any[],
  id: number | null;
  is_guilty: boolean;
  special_license: string | null;
  updated_at: string | null;
};
export type RoadAccidentCause = {
  id: number | null;
  name: string | null;
};
export type TechInspection = {
  car_id: number | null;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  created_at: string | null;
  date_end: string | null;
  date_start: string | null;
  gov_number: string | null;
  id?: number;
  is_allowed: boolean;
  note: string | null;
  reg_number: string | null;
  tech_operator: string | null;
  updated_at: string | null;
  files?: any[];
};
export type TechMaintOrder = {
  car_model_id: number | null;
  car_model_name: string;
  description: string;
  entity_name: string;
  id?: number;
  interval_probeg: number | null;
  interval_time: number | null;
  interval_time_type: number | null;
  is_periodic: boolean;
  measure_unit_run_id: number | null;
  measure_unit_run_name: string;
  sequence: number | null;
  tech_maintenance_type_id: number | null;
  tech_maintenance_type_name: string;
  files?: any[];
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
  id: number | null;
  name: string | null;
  tire_manufacturer_id: number | null;
  tire_manufacturer_name: string | null;
};
export type TireManufacturer = {
  id: number;
  name: string;
};
export type Tire = {
  car_id: number | null;
  comment: string;
  company_id: number | null;
  company_name: string;
  gov_number: string;
  id?: number;
  installed_at: string | null;
  motohours_diff: number | null;
  odometr_diff: number | null;
  tire_manufacturer_id: number | null;
  tire_manufacturer_name: string;
  tire_model_id: number | null;
  tire_model_name: string;
  tire_size_id: number | null;
  tire_size_name: string;
  tire_to_car: {
    car_id: number | null;
    gov_number: string | null;
    id?: number;
    installed_at: string;
    motohours_diff: number | null;
    odometr_diff: number | null;
    uninstalled_at: string;
  }[];
  tire_to_car_id: number | null;
  uninstalled_at: string | null;
};
export type TireSize = {
  id: number;
  name: string;
};
export type TireAvailableCar = {
  car_id: number;
  gov_number: string;
};

export type ActualBatteriesOnCar = {
  battery_to_car_id: number | null;
  brand_id: number | null;
  brand_name: string | null;
  car_id: number | null;
  company_id: number | null;
  company_name: string | null;
  gov_number: string | null;
  id: number;
  installed_at: string;
  lifetime_months: number | null;
  manufacturer_id: number | null;
  manufacturer_name: string | null;
  odometr_start: string | null;
  released_at: string;
  serial_number: string | null;
  uninstalled_at: string;
  worked_months: number | null;
};
export type ActualTiresOnCar = {
  car_id: number | null;
  comment: string | null;
  company_id: number | null;
  company_name: string | null;
  gov_number: string | null;
  id: number;
  installed_at: string;
  motohours_diff: number | null;
  odometr_diff: number | null;
  tire_manufacturer_id: number | null;
  tire_manufacturer_name: string | null;
  tire_model_id: number | null;
  tire_model_name: string | null;
  tire_size_id: number | null;
  tire_size_name: string | null;
  tire_to_car_id: number | null;
  uninstalled_at: string;
};
export type TechMaint = {
  can_edit: boolean;
  car_id: number | null;
  company_id: number | null;
  company_name: number | null;
  company_short_name: number | null;
  fact_date_end: string | null;
  fact_date_start: string | null;
  gov_number: number | null;
  id: number | null;
  motohours_fact: number;
  note: string;
  number: number | string | null;
  odometr_fact: number;
  plan_date_end: string;
  plan_date_start: string;
  repair_company_id: number | null;
  repair_company_name: string | null;
  tech_maintenance_order_ids: number[]
  tech_maintenance_orders: {
    car_model_id: number | null;
    car_model_name: string | null;
    description: string | null;
    entity_name: string | null;
    id: number;
    interval_probeg: number | null;
    interval_time: number | null;
    interval_time_type: string | null;
    is_periodic: boolean;
    measure_unit_run_id: number | null;
    measure_unit_run_name: string | null;
    sequence: number | null;
    tech_maintenance_type_id: number | null;
    tech_maintenance_type_name: string | null;
  }[]
  tech_maintenance_orders_text: string | null;
  files: any[];
};
export type TechMaintExtra = {
  car_interval_probeg: number | null;
  car_interval_time: number | null;
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
  car_func_type_id: number | null;
  data_rate: number | null;
  end_date: string | null;
  equip_width: number | null;
  full_name: string;
  id: number;
  is_check_gov_number: number | null;
  mkad_speed_lim: number | null;
  object_type_id: number | null;
  object_type_name: string;
  oper_type_id: number | null;
  oper_type_name: string;
  parent_id: number | null;
  route_type: string;
  season_id: number | null;
  season_name: string;
  short_name: string;
  speed_lim: number | null;
  work_class_code: string;
  work_class_id: number | null;
  work_class_name: string;
  work_class_short_name: string;
};

export type IStateAutobase = {
  sparePartList: SparePart[];
  measureUnitList: MeasureUnit[];
  sparePartGroupList: SparePartGroup[];
  batteryBrandList: BatteryBrand[];
  batteryManufacturerList: BatteryManufacturer[];
  batteryRegistryList: BatteryRegistry[];
  batteryAvailableCarList: BatteryAvailableCar[];
  insuranceTypeList: InsuranceType[];
  insurancePolicyList: InsurancePolicy[];
  carList: Car[];
  carFuncTypesList: CarFuncTypes[];
  repairList: Repair[];
  repairCompanyList: RepairCompany[];
  repairTypeList: RepairType[];
  roadAccidentList: RoadAccident[];
  roadAccidentCauseList: RoadAccidentCause[];
  techInspectionList: TechInspection[];
  techMaintOrderList: TechMaintOrder[];
  techMaintTypeList: TechMaintType[];
  measureUnitRunList: MeasureUnitRun[];
  tireModelList: TireModel[];
  tireManufacturerList: TireManufacturer[];
  tireList: Tire[];
  tireSizeList: TireSize[];
  tireAvailableCarList: TireAvailableCar[];
  actualBatteriesOnCarList: ActualBatteriesOnCar[];
  actualTiresOnCarList: ActualTiresOnCar[];
  techMaintList: TechMaint[];
  techMaintExtra: TechMaintExtra;
  carCategoryList: CarCategory[];
  engineTypeList: EngineType[];
  propulsionTypeList: PropulsionType[];
  fuelCardsList: FuelCards[];
  fuelTypeList: FuelType[];
  typesAttrList: TypesAttr[];
};
