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
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsInsurancePolicyWithForm = WithFormRegistrySearchAddProps<InsurancePolicy> & { selectedCarData?: CarWrap };

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
