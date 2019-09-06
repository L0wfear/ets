import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carStructureFilter, carActualOptionLabel } from '../waybill_car_id/useWaybillCarActualOptions';

export const carFilterByIsTrailer = (car: Car) => {
  return (
    car.is_trailer
  );
};

export const trailerFilter = (car: Car, trailer_id: Waybill['trailer_id'], structure_id: Waybill['structure_id']) => {
  return (
    car.asuods_id === trailer_id
    || (
      carStructureFilter(car, structure_id)
      && carFilterByIsTrailer(car)
    )
  );
};

const useWaybillCarActualOptions = (formDataKey: string, trailer_id: Waybill['trailer_id'], structure_id: Waybill['structure_id']) => {
  const listData = useCarActualOptions();

  const waybillCarActualTrailerOptions = React.useMemo(
    () => {
      return {
        options: listData.options.reduce(
          (newArr, { rowData }) => {
            if (trailerFilter(rowData, trailer_id, structure_id)) {
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
    [listData, trailer_id, structure_id],
  );

  return waybillCarActualTrailerOptions;
};

export default useWaybillCarActualOptions;
