import memoize from 'memoize-one';

import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export const makeLabelForMissionTemplateCarOption = (carData: Partial<Car> & Pick<Car, 'gov_number' | 'type_name'>) => {
  let label = carData.gov_number;

  const {
    model_name,
    special_model_name,
    type_name,
  } = carData;

  if (model_name || special_model_name || type_name) {
    label = `${label} [${model_name || ''}${model_name ? '/' : ''}${special_model_name || ''}${type_name ? '/' : ''}${type_name || ''}]`;
  }

  return label;
};

export const makeOptionsForMissiontemplate = (
  memoize(
    (
      carList: Car[],
      structure_id: MissionTemplate['structure_id'],
    ) => (
      carList.reduce<DefaultSelectOption<Car['asuods_id'], string, Partial<Car>>[]>((newArr, carData) => {
        if (!structure_id || carData.is_common || carData.company_structure_id === structure_id) {
          newArr.push({
            value: carData.asuods_id,
            label: makeLabelForMissionTemplateCarOption(carData),
            rowData: carData,
          });
        }

        return newArr;
      }, [])
    ),
  )
);
