import { get, uniqBy, uniq } from 'lodash';

import { ConsumableMaterial, ConsumableMaterialWrap } from './@types/consumableMaterial';
import { ConsumableMaterialService } from 'api/Services';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export const makeConsumableMaterialFront = (array: ConsumableMaterial[]) => (
  (array).map(
    (rowData): ConsumableMaterialWrap => ({
      ...rowData,
      technical_operation_ids: uniqBy(rowData.norms, 'technical_operation_id')
        .map(({ technical_operation_id }) => technical_operation_id),
      technical_operation_names: uniqBy(rowData.norms, 'technical_operation_name')
        .map(({ technical_operation_name }) => technical_operation_name),
      municipal_facility_ids: uniqBy(rowData.norms, 'municipal_facility_id')
        .map(({ municipal_facility_id }) => municipal_facility_id),
      municipal_facility_names: uniqBy(rowData.norms, 'municipal_facility_name')
        .map(({ municipal_facility_name }) => municipal_facility_name),
      to_element: uniq(
        rowData.norms.map(({ technical_operation_name, municipal_facility_name }) => (
          `${technical_operation_name}[${municipal_facility_name}]`
        )),
      ),
    }),
  )
);

export const promiseSubmitConsumableMaterial = (consumableMateriaOwn: ConsumableMaterial) => {
  const consumableMateria = {
    ...consumableMateriaOwn,
    norms: consumableMateriaOwn.norms.map((rowData) => ({
      ...rowData,
      value: getNumberValueFromSerch(rowData.value),
    })),
  };

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
