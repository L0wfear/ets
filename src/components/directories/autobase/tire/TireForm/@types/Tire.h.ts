import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  AutobaseCreateTire,
  AutobaseUpdateTire,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tire/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTireFormWrap = {
  showForm: boolean;
  element: Tire | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTire = {
  tireModelList: IStateAutobase['tireModelList'];
  tireSizeList: IStateAutobase['tireSizeList'];
};
export type DispatchPropsTire = {
  createAction: AutobaseCreateTire;
  updateAction: AutobaseUpdateTire;
  tireSizeGetAndSetInStore: any;
  tireModelGetAndSetInStore: any;
};
export type OwnTireProps = {
  element: Tire | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsTireWithForm = (
  StatePropsTire
  & DispatchPropsTire
  & OwnTireProps
);

export type PropsTire = OutputWithFormProps<
  PropsTireWithForm,
  Tire,
  [ Tire ],
  any
>;
export type StateTire = {
  canSave: boolean;
};
