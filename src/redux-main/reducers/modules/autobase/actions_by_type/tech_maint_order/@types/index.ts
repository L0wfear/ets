import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTechMaintOrder = (techMaintOrderOld: Repair & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateTechMaintOrder = (techMaintOrderOld: Repair, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepair = () => Promise<any>;
