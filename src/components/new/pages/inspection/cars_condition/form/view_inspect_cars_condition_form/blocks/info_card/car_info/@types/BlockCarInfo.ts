import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type BlockCarInfoOwnProps = {
  element: Partial<CarsConditionCars>;
  carsConditionCarsList: CarsConditionCars[];
  handleHide: (isSubmitted: boolean) => void;

  page: string;
  path?: string;
};
export type BlockCarInfoProps = OutputWithFormProps<
  BlockCarInfoOwnProps,
  CarsConditionCars,
  [ CarsConditionCars ],
  any
>;
