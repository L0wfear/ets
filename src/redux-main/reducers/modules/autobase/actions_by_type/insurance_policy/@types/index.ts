import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateInsurancePolicy = (insurancePolicyOld: InsurancePolicy & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateInsurancePolicy = (insurancePolicyOld: InsurancePolicy, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
