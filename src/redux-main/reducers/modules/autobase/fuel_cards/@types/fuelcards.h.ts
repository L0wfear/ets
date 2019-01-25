export type FuelCards = { // Доделать типчик, после первого get
  id: number | null;
  number: string | null; // Поле "Номер"
  fuel_type: string | null; // Поле «Тип топлива»
  company_id: number | null;
  company_name: string | null;
  company: string | null; // Организация
};

export type StateFuelCards = {
  fuelCardsList: FuelCards[];
}

// import { FuelCards } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

// export type AutobaseCreateFuelCards = (fuelCardsOld: FuelCards & { id?: number }, { page, path }: { page: string; path?: string }) => (
//   Promise<any>
// );

// export type AutobaseUpdateFuelCards = (fuelCardsOld: FuelCards, { page, path }: { page: string; path?: string }) => (
//   Promise<any>
// );
