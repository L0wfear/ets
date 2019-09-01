import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { BlockCarInfoProps } from '../../../../@types/BlockCarInfo';
import { ExtField } from 'components/old/ui/new/field/ExtField';

type FieldCarsConditionsCarSeasonProps = {
  value: CarsConditionCars['season'];
  error: string;
  handleChange: BlockCarInfoProps['handleChange'];
  isPermitted: boolean;
  page: string;
  path?: string;
};

const seasonOptions = [
  { value: 'Лето', label: 'Лето' },
  { value: 'Зима', label: 'Зима' },
  { value: 'Всесезон', label: 'Всесезон' },
];

const FieldCarsConditionsCarSeason: React.FC<FieldCarsConditionsCarSeasonProps> = (props) => {
  return (
    <ExtField
      type="select"
      label="Сезон:"
      value={props.value}
      onChange={props.handleChange}
      options={seasonOptions}
      error={props.error}
      boundKeys="season"
      clearable={false}
      disabled={!props.isPermitted}
    />
  );
};

export default FieldCarsConditionsCarSeason;
