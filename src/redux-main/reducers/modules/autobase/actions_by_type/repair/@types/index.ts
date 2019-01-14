import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateRepair = (repairOld: Repair & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateRepair = (repairOld: Repair, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepair = () => Promise<any>;
