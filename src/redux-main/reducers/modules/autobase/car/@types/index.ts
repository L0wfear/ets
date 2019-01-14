import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseUpdateCar = (carOld: Car, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetCar = () => Promise<any>;
