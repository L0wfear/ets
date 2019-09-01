import {
  Repair,
  RepairCompany,
  RepairType,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
} from 'components/old/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
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

export type OwnRepairProps = {
  element: Repair | null;
  handleHide: OnFormHideType;
  selectedCarData?: CarWrap;

  page: string;
  path?: string;
};

export type PropsRepairWithForm = StatePropsRepair &
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
