import { isObject } from 'util';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

export const defaultMaterialConsumptionRate: MaterialConsumptionRate = {
  clean_category_id: null,
  clean_category_name: '',
  clean_subcategory_id: null,
  clean_subcategory_name: '',
  consumable_material_id: null,
  consumable_material_name: '',
  id: null,
  season_id: null,
  season_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  value: null,
};

export const getDefaultMaterialConsumptionRateElement = (element: Partial<MaterialConsumptionRate>) => {
  const newElement = { ...defaultMaterialConsumptionRate };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
