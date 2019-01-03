import { CarCategory } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateCarCategory = (carCategoryOld: CarCategory & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateCarCategory = (carCategoryOld: CarCategory, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetCarCategory = () => (
  Promise<any>
);
