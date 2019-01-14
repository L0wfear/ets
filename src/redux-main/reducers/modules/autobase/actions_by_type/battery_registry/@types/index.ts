import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type AutobaseCreateBatteryRegistry = (batteryRegistryOld: BatteryRegistry & { id?: number }, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);

export type AutobaseUpdateBatteryRegistry = (batteryRegistryOld: BatteryRegistry, { page, path }: { page: string; path?: string }) => (
  Promise<any>
);
