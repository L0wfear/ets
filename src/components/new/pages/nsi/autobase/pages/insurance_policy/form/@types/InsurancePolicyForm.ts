import {
  InsurancePolicy,
  InsuranceType,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
  DefaultSelectOption,
} from 'components/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsInsurancePolicyFormLazy = {
  element: InsurancePolicy | null;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsInsurancePolicy = {};
export type DispatchPropsInsurancePolicy = {
  autobaseGetInsuranceType: HandleThunkActionCreator<typeof autobaseActions.autobaseGetInsuranceType>;
  autobaseGetSetCar: HandleThunkActionCreator<typeof autobaseActions.autobaseGetSetCar>;
};
export type OwnInsurancePolicyProps = {
  element: InsurancePolicy | null;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsInsurancePolicyWithForm = (
  StatePropsInsurancePolicy
  & DispatchPropsInsurancePolicy
  & OwnInsurancePolicyProps
) & WithSearchProps;

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
