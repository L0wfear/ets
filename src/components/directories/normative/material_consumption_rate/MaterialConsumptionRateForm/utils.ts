import { isObject } from 'util';
import { IMaterialConsumptionRateUpd } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

export type GetDefaultMaterialConsumptionRateElement = (IMaterialConsumptionRateUpd: IMaterialConsumptionRateUpd | null) => IMaterialConsumptionRateUpd;

export const defaultMaterialConsumptionRate: IMaterialConsumptionRateUpd = {
  id: null,
  technical_operation_id: null,
  consumable_material_id: null,
  season_id: null,
  clean_category_id: null,
  clean_subcategory_id: null,
  value: null,
};

export const getDefaultMaterialConsumptionRateElement: GetDefaultMaterialConsumptionRateElement = (element) => {
  const newElement = { ...defaultMaterialConsumptionRate };
  if (isObject(element)) {
    Object.entries(element).forEach(([key, value]) => {
      newElement[key] = element[key] || value;
    });
  }

  return newElement;
};
