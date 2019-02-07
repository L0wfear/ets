import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateTechInspection = (techInspectionOld: Repair & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateTechInspection = (techInspectionOld: Repair, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetRepair = () => Promise<any>;
