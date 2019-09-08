export const car_actual_types = {
  car_actual_add_battery: 'car_actual_add_battery',
  car_actual_add_tire: 'car_actual_add_tire',
} as const;

export const car_actual_types_reverse = Object.entries(car_actual_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
