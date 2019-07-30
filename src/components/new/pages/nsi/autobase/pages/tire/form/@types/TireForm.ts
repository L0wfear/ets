import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTireFormLazy = {
  element: Partial<Tire>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsTire = {
  tireModelList: IStateAutobase['tireModelList'];
  tireSizeList: IStateAutobase['tireSizeList'];
  isPermitterToUpdateInitialMileage: boolean;
};
export type DispatchPropsTire = {
  tireSizeGetAndSetInStore: any;
  tireModelGetAndSetInStore: any;
};
export type OwnTireProps = {
  element: Partial<Tire>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsTireWithForm = (
  StatePropsTire
  & DispatchPropsTire
  & OwnTireProps
  & WithSearchProps
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
