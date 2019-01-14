import { RepairType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateRepairType = (repairTypeOld: RepairType & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateRepairType = (repairTypeOld: RepairType, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepairType = () => Promise<any>;
