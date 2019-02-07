import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTire = (tireOld: Tire & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateTire = (tireOld: Tire, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
