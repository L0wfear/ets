import { FuelOperation } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

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
  rate_on_date?: number;
  season?: string;
  summer_rate: number | null;
  winter_rate: number | null;
};

export type IStateFuelRates = {
  fuelRatesList: Array<FuelRate>;
  fuelRateOperationsList: Array<FuelOperation>;
  fuelRateOperationsIsActiveList: Array<FuelOperation>;
};
