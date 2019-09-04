import {
  InsurancePolicy,
  InsuranceType,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
  DefaultSelectOption,
} from 'components/old/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../car_actual/form/@types/CarForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsInsurancePolicyFormLazy = {
  element: InsurancePolicy | null;
  onFormHide: OnFormHideType;
  selectedCarData?: CarWrap;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type OwnInsurancePolicyProps = {
  element: InsurancePolicy | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

  page: string;
  path?: string;
};

export type PropsInsurancePolicyWithForm = (
  OwnInsurancePolicyProps
);

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
