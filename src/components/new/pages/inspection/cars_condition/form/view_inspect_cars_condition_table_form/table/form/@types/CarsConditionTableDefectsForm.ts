import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarsConditionTableDefects } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export type PropsCarsConditionTableDefectsWithForm = {
  element: CarsConditionTableDefects;
  page: string;
  registryKey: string;
  onFormHide: () => void;
};

export type PropsCarsConditionTableDefects = OutputWithFormProps<
  PropsCarsConditionTableDefectsWithForm,
  CarsConditionTableDefects,
  [ CarsConditionTableDefects ],
  any
>;
