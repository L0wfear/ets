import { TireModel, IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateTireModel,
  AutobaseUpdateTireModel,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTireModelFormWrap = {
  showForm: boolean;
  element: TireModel | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTireModel = {
  tireManufacturerList: IStateAutobase['tireManufacturerList'];
};
export type DispatchPropsTireModel = {
  createAction: AutobaseCreateTireModel;
  updateAction: AutobaseUpdateTireModel;
  tireManufacturerGetAndSetInStore: any;
};
export type OwnTireModelProps = {
  element: TireModel | null;
  handleHide: OnFormHideType
  page?: string;
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
export type StateTireModel = {
};
