import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarDriversData, CarRegistrationData, CarPassporntData } from 'redux-main/reducers/modules/autobase/car/@types';
import { OneTabDataCommon } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';

export type CarWrap = (
  Car
  & {
    drivers_data: CarDriversData;
    registration_data: CarRegistrationData;
    passport_data: CarPassporntData
  }
);

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCarFormLazy = {
  element: Partial<CarWrap>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsCar = {
};
export type DispatchPropsCar = {
};
export type OwnCarProps = {
  element: Partial<CarWrap>;
  handleHide: OnFormHideType;

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
);

export type PropsCar = OutputWithFormProps<
  PropsCarWithForm,
  CarWrap,
  [ CarWrap ],
  any
>;

export type DefaultOwnPropsToBodyRoute = OneTabDataCommon & {
  isActive: boolean;
};
