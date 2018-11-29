import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateCarFuncTypes = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
export type AutobaseUpdateCarFuncTypes = (carFuncTypesOld: CarFuncTypes, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetCarFuncTypes = () => Promise<any>;
