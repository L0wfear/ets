import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTireModel = (tireModelOld: TireModel & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateTireModel = (tireModelOld: TireModel, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetTireModel = () => Promise<any>;
