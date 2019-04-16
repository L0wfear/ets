import { isObject, isNullOrUndefined } from 'util';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const defaultTire: Tire = {
  car_id: null,
  comment: '',
  company_id: null,
  company_name: '',
  gov_number: '',
  id: null,
  installed_at: null,
  motohours_diff: null,
  odometr_diff: null,
  tire_manufacturer_id: null,
  tire_manufacturer_name: '',
  tire_model_id: null,
  tire_model_name: '',
  tire_size_id: null,
  tire_size_name: '',
  tire_to_car: [],
  tire_to_car_id: null,
  uninstalled_at: null,
};

export const getDefaultTireElement = (element: Partial<Tire>): Tire => {
  const newElement = { ...defaultTire };
  if (isObject(element)) {
    Object.keys(defaultTire).forEach((key: keyof Tire) => {
      if (key === 'tire_to_car') {
        if (!isNullOrUndefined(element[key])) {
          newElement[key] = element[key].map((rowData, index) => {
            return {
              ...rowData,
              customId: index + 1,
            };
          });
        } else {
          newElement[key] = defaultTire[key];
        }
      } else {
        newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultTire[key];
      }
    });
  }

  return newElement;
};
