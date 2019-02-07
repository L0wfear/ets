import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTechMaint = (techMaintOld: Repair & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateTechMaint = (techMaintOld: Repair, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepair = () => Promise<any>;
