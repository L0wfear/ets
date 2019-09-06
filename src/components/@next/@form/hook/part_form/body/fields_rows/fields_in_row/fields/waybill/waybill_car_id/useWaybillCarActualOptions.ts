import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';

const validCarTypesSet = new Set();
validCarTypesSet.add(69); // GENERATOR
validCarTypesSet.add(15); // COMPRESSOR

export const carActualOptionLabel = (
  gov_number: Car['gov_number'],
  model_name: Car['model_name'],
  special_model_name: Car['special_model_name'],
  type_name: Car['type_name'],
) => {
  return `${gov_number} [${model_name || ''}${ model_name ? '/' : ''}${special_model_name || ''}${type_name ? '/' : ''}${type_name || ''}]`;
};

export const carStructureFilter = (car: Car, structure_id: Waybill['structure_id']) => {
  return (
    car.available_to_bind
    && (
      !structure_id
      || car.is_common
      || car.company_structure_id === structure_id
    )
  );
};

export const carFilterByTrailer = (car: Car) => {
  return (
    !car.is_trailer
    || validCarTypesSet.has(car.type_id)
  );
};

export const carFilter = (car: Car, car_id: Waybill['car_id'], structure_id: Waybill['structure_id']) => {
  return (
    car.asuods_id === car_id
    || (
      carStructureFilter(car, structure_id)
      && carFilterByTrailer(car)
    )
  );
};

const useWaybillCarActualOptions = (formDataKey: string, car_id: Waybill['car_id'], structure_id: Waybill['structure_id']) => {
  const listData = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'carActualList'>(
    formDataKey,
    'carActualList',
    useCarActualOptions(),
  );

  const waybillCarActualOptions = React.useMemo(
    () => {
      return {
        options: listData.options.reduce(
          (newArr, { rowData }) => {
            if (carFilter(rowData, car_id, structure_id)) {
              newArr.push({
                value: rowData.asuods_id,
                label: carActualOptionLabel(rowData.gov_number, rowData.model_name, rowData.special_model_name, rowData.type_name),
                rowData,
              });
            }

            return newArr;
          },
          [],
        ),
        isLoading: listData.isLoading,
      };
    },
    [listData, car_id, structure_id],
  );

  return waybillCarActualOptions;
};

export default useWaybillCarActualOptions;
