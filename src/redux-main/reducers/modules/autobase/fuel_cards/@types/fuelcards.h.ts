export type FuelCard = {
  id: number | null;
  number: string | null; // Поле "Номер"
  fuel_type: string | null; // Поле «Тип топлива»
  company_id: number | null;
  company_name: string | null;
  company: string | null; // Организация
  is_used_in_waybill: boolean | null;
  is_archive: boolean;
  fuel_type_text: string | null;
  structure_id: number | null;
  is_common: boolean | null;
  structure_name: string | null;
};

export type StateFuelCards = {
  fuelCardsList: Array<FuelCard>;
};

export type FuelType = {
  id: string;
  name: string | null;
};

export type getFuelType = () => any;
