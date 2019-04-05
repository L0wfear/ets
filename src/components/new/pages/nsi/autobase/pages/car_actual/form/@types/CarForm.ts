import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarDriversData } from 'redux-main/reducers/modules/autobase/car/@types';
import { actionGetCarDrivers } from 'redux-main/reducers/modules/autobase/car/actions';
import { HandleThunkActionCreator } from 'react-redux';

export type CarWrap = (
  Car
  & {
    drivers_data: CarDriversData;
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
  actionGetCarDrivers: HandleThunkActionCreator<typeof actionGetCarDrivers>;
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
