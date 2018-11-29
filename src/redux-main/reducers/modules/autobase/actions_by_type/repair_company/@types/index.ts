import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateRepairCompany = (repairCompanyOld: RepairCompany & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateRepairCompany = (repairCompanyOld: RepairCompany, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepairCompany = () => Promise<any>;
