import {
  InsurancePolicy,
  InsuranceType,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
  DefaultSelectOption,
} from 'components/ui/input/ReactSelect/utils';
import { GetInsurancePolicyType } from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { HandleThunkActionCreator } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsInsurancePolicyFormWrap = {
  showForm: boolean;
  element: InsurancePolicy | null;
  car_id: number;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsInsurancePolicy = {};
export type DispatchPropsInsurancePolicy = {
  autobaseGetInsuranceType: GetInsurancePolicyType;
  autobaseGetSetCar: HandleThunkActionCreator<
    typeof autobaseActions.autobaseGetSetCar
  >;
};
export type OwnInsurancePolicyProps = {
  element: InsurancePolicy | null;
  handleHide: OnFormHideType;
  car_id: number;

  page: string;
  path?: string;
};

export type PropsInsurancePolicyWithForm = StatePropsInsurancePolicy &
  DispatchPropsInsurancePolicy &
  OwnInsurancePolicyProps;

export type PropsInsurancePolicy = OutputWithFormProps<
  PropsInsurancePolicyWithForm,
  InsurancePolicy,
  [InsurancePolicy],
  any
>;
export type StateInsurancePolicy = {
  insuranceTypeOptions: DefaultSelectListMapper<InsuranceType>;
  carListOptions: DefaultSelectOption<
    Car['asuods_id'],
    Car['gov_number'],
    Car
  >[];
};
