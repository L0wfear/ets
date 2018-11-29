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
  id?: number | null;
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
  asuods_id: number;
  gov_number: string;
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

export type IStateAutobase = {
  sparePartList: SparePart[];
  measureUnitList: MeasureUnit[];
  sparePartGroupList: SparePartGroup[];
  batteryBrandList: BatteryBrand[];
  batteryManufacturerList: BatteryManufacturer[];
  batteryRegistryList: BatteryRegistry[];
  insuranceTypeList: InsuranceType[];
  insurancePolicyList: InsurancePolicy[];
  carList: Car[];
  carFuncTypesList: CarFuncTypes[];
  repairList: Repair[];
  repairCompanyList: RepairCompany[];
  repairTypeList: RepairType[];
};
