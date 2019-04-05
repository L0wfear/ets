import { TireModel, IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTireModelFormLazy = {
  element: TireModel | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsTireModel = {
  tireManufacturerList: IStateAutobase['tireManufacturerList'];
};
export type DispatchPropsTireModel = {
  tireManufacturerGetAndSetInStore: any;
};
export type OwnTireModelProps = {
  element: TireModel | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsTireModelWithForm = (
  StatePropsTireModel
  & DispatchPropsTireModel
  & OwnTireModelProps
);

export type PropsTireModel = OutputWithFormProps<
  PropsTireModelWithForm,
  TireModel,
  [ TireModel ],
  any
>;
