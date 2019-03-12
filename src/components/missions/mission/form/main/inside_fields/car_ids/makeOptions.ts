import memoize from 'memoize-one';
import { get } from 'lodash';

import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export const makeLabelForMissionCarOption = (carData: Partial<Car> & Pick<Car, 'gov_number' | 'type_name'>) => {
  let label = get(carData, 'gov_number', '-');

  const model_name = get(carData, 'model_name', null);
  const special_model_name = get(carData, 'special_model_name', null);
  const type_name = get(carData, 'type_name', null);

  if (model_name || special_model_name || type_name) {
    label = `${label} [${model_name || ''}${model_name ? '/' : ''}${special_model_name || ''}${type_name ? '/' : ''}${type_name || ''}]`;
  }

  return label;
};

export const makeOptionsForMission = (
  memoize(
    (
      carList: Car[],
      structure_id: Mission['structure_id'],
      withCheckAvailableToBind?: boolean,
    ) => (
      carList.reduce<DefaultSelectOption<Car['asuods_id'], string, Partial<Car>>[]>((newArr, carData) => {
        if (!structure_id || carData.is_common || carData.company_structure_id === structure_id) {
          if (!withCheckAvailableToBind || carData.available_to_bind) {
            newArr.push({
              value: carData.asuods_id,
              label: makeLabelForMissionCarOption(carData),
              rowData: carData,
            });
          }
        }

        return newArr;
      }, [])
    ),
  )
);
