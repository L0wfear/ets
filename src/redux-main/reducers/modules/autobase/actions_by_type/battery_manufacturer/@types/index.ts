import { BatteryManufacturer } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateBatteryManufacturer = (batteryManufacturerOld: BatteryManufacturer & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateBatteryManufacturer = (batteryManufacturerOld: BatteryManufacturer, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type GetBatteryManufacturer = () => (
  Promise<any>
);
