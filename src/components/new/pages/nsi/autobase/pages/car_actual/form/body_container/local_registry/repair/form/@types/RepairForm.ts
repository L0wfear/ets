import {
  Repair,
  RepairCompany,
  RepairType,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
} from 'components/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { GetRepairCompany } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/@types';
import { GetRepairType } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/@types';
import { CarWrap } from '../../../../../@types/CarForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsRepairFormWrap = {
  element: Repair | null;
  selectedCarData?: CarWrap;
  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRepair = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsRepair = {
  autobaseGetRepairCompany: GetRepairCompany;
  autobaseGetRepairType: GetRepairType;
};
export type OwnRepairProps = {
  element: Repair | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

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
  repairCompanyOptions: DefaultSelectListMapper<RepairCompany>;
  repairTypeOptions: DefaultSelectListMapper<RepairType>;
};
