export const batteryToCarMap = (carData, index) => {
  carData.customId = index + 1;

  return carData;
};

export const modufyBatteryData = (batteryData) => {
  batteryData.battery_to_car = batteryData.battery_to_car.map(batteryToCarMap);

  return batteryData;
};
