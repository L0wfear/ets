import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCarFormLazy = {
  element: Partial<Car>;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsCar = {
};
export type DispatchPropsCar = {
};
export type OwnCarProps = {
  element: Partial<Car>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type MergedCarProps = (
  StatePropsCar
  & DispatchPropsCar
  & OwnCarProps
);

export type PropsCarWithForm = (
  MergedCarProps
  & WithSearchProps
);

export type PropsCar = OutputWithFormProps<
  PropsCarWithForm,
  Car,
  [ Car ],
  any
>;
