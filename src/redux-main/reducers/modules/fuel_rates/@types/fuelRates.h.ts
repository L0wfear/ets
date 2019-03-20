export type FuelRate = {
  body_capacity: number | null;
  car_model_id: number | null;
  car_model_name: string | null;
  car_special_model_id: number | null;
  car_special_model_name: string | null;
  comment: string | null;
  company_id: number | null;
  company_name: string | null;
  company_structure_id: number | null;
  company_structure_name: string | null;
  full_model_name: string | null;
  id: number | null;
  is_excluding_mileage: boolean | null;
  load_capacity: number | null;
  max_speed: number | null;
  measure_unit_id: number | null;
  measure_unit_name: string | null;
  model_name: string | null;
  operation_equipment: boolean | null;
  operation_id: number | null;
  operation_name: string | null;
  order_date: string | null;
  summer_rate: number | null;
  winter_rate: number | null;
};

export type FuelOperation = { // перенести в реестр FuelOperation, после его рефакторинга
  equipment: boolean | null;
  id: number | null;
  is_excluding_mileage: boolean | null;
  measure_unit_id: number | null;
  measure_unit_name: string | null;
  name: string | null;
  is_active?: boolean | null;
};

export type IStateFuelRates = {
  fuelRatesList: FuelRate[],
  fuelRateOperationsList: FuelOperation[],
  fuelRateOperationsIsActiveList: FuelOperation[],
};

export type IFuelRatesByCarModel = {
  car_id?: number | null;
  datetime?: string | null;
};

export type IEquipmentFuelRatesByCarModel = {
  car_id?: number | null;
  datetime?: string | null;
  for_equipment?: boolean | null;
};
