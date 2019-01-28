export type FuelCards = { // Доделать типчик, после первого get
  id: number | null;
  number: string | null; // Поле "Номер"
  fuel_type: string | null; // Поле «Тип топлива»
  company_id: number | null;
  company_name: string | null;
  company: string | null; // Организация
  fuel_type_text: string | null;
};

export type StateFuelCards = {
  fuelCardsList: FuelCards[];
};

export type Company = {
  id?: number | null;
  asuods_id?: number;
  company_id?: number;
  name: string | null;
};

export type FuelType = {
  id: string;
  name: string | null;
};

export type AutobaseCreateFuelCards = (fuelCardsOld: FuelCards & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateFuelCards = (fuelCardsOld: FuelCards, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type getFuelType = () => (
  any
);
