export const tireToCarMap = (carData, index) => {
  carData.customId = index + 1;

  return carData;
};

export const modufyTireyData = (tireData) => {
  tireData.tire_to_car = tireData.tire_to_car.map(tireToCarMap);

  return tireData;
};
