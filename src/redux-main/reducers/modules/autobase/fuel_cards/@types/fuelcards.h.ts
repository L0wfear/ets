export type FuelCardOnCars = {
  gov_number: string;
  car_id: number;
  company_id: number;
  installed_at: string;
  uninstalled_at: string;
  is_used_in_waybill: boolean;
  id: number;
  fuel_card_id: number;
  number: string;
  garage_number: string;
  decouple_reason: string;

  // для таблички
  customId?: number;
  isChecked?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  alredy_save: boolean; // уже производилось сохранение, данная строка пришла с бека
};

export type FuelCard = {
  id: number | null;
  number: string | null; // Поле "Номер"
  fuel_type: string | null; // Поле «Тип топлива»
  fuel_types: Array<string>;
  company_id: number | null;
  company_name: string | null;
  company_short_name: string | null;
  company: string | null; // Организация
  composite_id: string;
  is_used_in_waybill: boolean | null;
  is_archive: boolean;
  fuel_type_text: string | null;
  structure_id: number | null;
  is_common: boolean | null;
  okrug_name: string | null;
  structure_name: string | null;
  structure_name_text: string | null;
  released_at: string;
  date_end: string;
  car_id: number;
  gov_number_text: string;
  garage_number: string;
  fuel_card_on_cars: Array<FuelCardOnCars>;
  refill_sum: number;
  refill_sum_text: string;
  source_type_id: number;
  source_type_text: string;
  status: 'active' | 'locked';
  status_text: string;
  comment: string; // поле из синхры
  // для таблички с тачками
  origin_fuel_card_on_cars: Array<FuelCardOnCars>; // состояние таблички до редактирование
};

export type StateFuelCards = {
  fuelCardsList: Array<FuelCard>;
};

export type FuelType = {
  id: string;
  name: string | null;
};

export type getFuelType = () => any;
