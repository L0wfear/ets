import { isObject, isNullOrUndefined } from 'util';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';

export const defaultConsumableMaterial: ConsumableMaterial = {
  id: null,
  name: '',
  measure_unit_id: null,
  measure_unit_name: '',
};

export const getDefaultConsumableMaterialElement = (element: Partial<ConsumableMaterial>): ConsumableMaterial => {
  const newElement = { ...defaultConsumableMaterial };
  if (isObject(element)) {
    Object.keys(defaultConsumableMaterial).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultConsumableMaterial[key];
    });
  }

  return newElement;
};
