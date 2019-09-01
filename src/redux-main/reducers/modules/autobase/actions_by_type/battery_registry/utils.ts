import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const batteryToCarMap = (carData: ValuesOf<BatteryRegistry['battery_to_car']>, index: number) => {
  carData.customId = index + 1;

  return carData;
};

export const modifyBatteryData = (batteryData: BatteryRegistry) => {
  batteryData.battery_to_car = batteryData.battery_to_car.map(batteryToCarMap);

  return batteryData;
};
