import { ConsumableMaterial } from "./@types/consumableMaterial";
import { ConsumableMaterialService } from "api/Services";
import { get } from 'lodash';

export const promiseSubmitConsumableMaterial = (consumableMateria: ConsumableMaterial) => {
  if (!consumableMateria.id) {
    return promiseCreateConsumableMaterial(consumableMateria);
  }

  return promiseUpdateConsumableMaterial(consumableMateria);
};

export const promiseCreateConsumableMaterial = async (consumableMaterialNew: ConsumableMaterial) => {
  const response = await ConsumableMaterialService.post(
    {
      ...consumableMaterialNew,
      is_active: true,
    },
    false,
    'json',
  );

  const result: ConsumableMaterial = {
    ...consumableMaterialNew,
    ...get(response, 'result.0', {}),
  };

  return result;
};

export const promiseUpdateConsumableMaterial = async (consumableMaterial: ConsumableMaterial) => {
  const response = await ConsumableMaterialService.path(consumableMaterial.id).put(
    {
      ...consumableMaterial,
    },
    false,
    'json',
  );

  const result: ConsumableMaterial = {
    ...consumableMaterial,
    ...get(response, 'result.0', {}),
  };

  return result;
};
