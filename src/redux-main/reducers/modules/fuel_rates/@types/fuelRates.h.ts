export type fuelRate = {
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
  isChecked: undefined | null;
  isHighlighted: boolean | null;
  isSelected: boolean | null;
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
  rowNumber: number | null;
  summer_rate: number | null;
  winter_rate: number | null;
};

export interface FuelRateU extends fuelRate {
  // todo: !!! Проверить тип у season, rate_on_date
  rate_on_date: number | null; // Для updateFuelRate
  season: string | null; // Для updateFuelRate
}

export type fuelOperation = {
  equipment?: boolean | null;
  id?: number | null;
  is_excluding_mileage?: boolean | null;
  measure_unit_id?: number | null;
  measure_unit_name?: string | null;
  name?: string | null;
};

export type IStateFuelRates = {
  fuelRatesList: fuelRate[],
  fuelRateOperations: fuelOperation[],
};

export type IFuelOperations = {
  is_active?: boolean | null;
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

export type ICreateFuel = {
  car_model_id: number | null;
  car_special_model_id: number | null;
  company_structure_id: number | null;
  operation_id: number | null;
  order_date: string | null;
  summer_rate: number | null;
  winter_rate: number | null;
  car_model_name: string | null;
  car_special_model_name: string | null;
};
