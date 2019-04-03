import {
  Repair,
  Car,
  RepairCompany,
  RepairType,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
  DefaultSelectOption,
} from 'components/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { GetRepairCompany } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/@types';
import { GetRepairType } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/@types';
import { HandleThunkActionCreator } from 'react-redux';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRepairFormWrap = {
  showForm: boolean;
  element: Repair | null;
  car_id: number;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRepair = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsRepair = {
  autobaseGetSetCar: HandleThunkActionCreator<
    typeof autobaseActions.autobaseGetSetCar
  >;
  autobaseGetRepairCompany: GetRepairCompany;
  autobaseGetRepairType: GetRepairType;
};
export type OwnRepairProps = {
  element: Repair | null;
  handleHide: OnFormHideType;
  car_id: number;
  page: string;
  path?: string;
};

export type PropsRepairWithForm = StatePropsRepair &
  DispatchPropsRepair &
  OwnRepairProps;

export type PropsRepair = OutputWithFormProps<
  PropsRepairWithForm,
  Repair,
  [Repair],
  any
>;
export type StateRepair = {
  carListOptions: DefaultSelectOption<
    Car['asuods_id'],
    Car['gov_number'],
    Car
  >[];
  repairCompanyOptions: DefaultSelectListMapper<RepairCompany>;
  repairTypeOptions: DefaultSelectListMapper<RepairType>;
};
