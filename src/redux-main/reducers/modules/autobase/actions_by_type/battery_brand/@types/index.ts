import { BatteryBrand } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateBatteryBrand = (batteryBrandOld: BatteryBrand & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateBatteryBrand = (batteryBrandOld: BatteryBrand, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
