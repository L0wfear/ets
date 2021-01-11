import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { CarDriversData, CarRegistrationData, CarPassporntData, CarEmployeeData } from 'redux-main/reducers/modules/autobase/car/@types';
import { OneTabDataCommon } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/formConfig';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type CarWrap = (
  Car
  & {
    drivers_data: CarDriversData;
    registration_data: CarRegistrationData;
    passport_data: CarPassporntData;
    employee_data: CarEmployeeData;
  }
);

export type PropsCarWithForm = WithFormRegistrySearchAddProps<Partial<Car>>;

export type PropsCar = OutputWithFormProps<
  PropsCarWithForm,
  CarWrap,
  [ CarWrap ],
  any
>;

export type DefaultOwnPropsToBodyRoute = OneTabDataCommon & {
  isActive: boolean;
};

export type MileageTypesArray = Array<{
  value: number;
  label: string;
}>;