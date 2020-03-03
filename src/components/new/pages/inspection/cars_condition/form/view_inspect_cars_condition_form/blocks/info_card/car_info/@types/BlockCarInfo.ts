import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';

export type BlockCarInfoOwnProps = {
  element: Partial<CarsConditionCars>;
  carsConditionCarsList: Array<CarsConditionCars>;
  handleHide: (isSubmitted: boolean) => void;
  type: keyof typeof INSPECT_TYPE_FORM;
  isCustomUserCard: boolean;
  isPermittedChangeListParams: boolean;

  page: string;
  path?: string;
};
export type BlockCarInfoProps = OutputWithFormProps<
  BlockCarInfoOwnProps,
  CarsConditionCars,
  [ CarsConditionCars ],
  any
>;
