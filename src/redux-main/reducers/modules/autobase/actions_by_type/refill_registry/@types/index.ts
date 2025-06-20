export type Refill = {
  okrug_id: number;
  okrug_name: string;
  company_id: number;
  company_name: string;
  refill_at: string | Date;
  refill_at_text: string | Date;
  fuel_car_id: number;
  fuel_card_number: string;
  fuel_type_id: number;
  fuel_type: string;
  fuel_given: number;
  car_gov_number_text: string;
  tx_id: number;
  waybill_id: number;
  waybill_number: number;
  wb_fuel_card_ids: Array<number>;
  wb_fuel_card_numbers: string;
  wb_fuel_types: Array<string>;
  wb_fuel_types_text: string;
  gas_station_name: string;
  gas_station_address: string;
  structure_id: number;
  structure_name: string;
  op_type_name: string;
};