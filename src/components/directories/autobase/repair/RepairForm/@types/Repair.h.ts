import { Repair, Car, RepairCompany, RepairType } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import {
  AutobaseCreateRepair,
  AutobaseUpdateRepair,
} from 'redux-main/reducers/modules/autobase/actions_by_type/repair/@types';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { GetCar } from 'redux-main/reducers/modules/autobase/car/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { GetRepairCompany } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/@types';
import { GetRepairType } from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/@types';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsRepairFormWrap = {
  showForm: boolean;
  element: Repair | null;
  car_id: number;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsRepair = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};
export type DispatchPropsRepair = {
  createAction: AutobaseCreateRepair;
  updateAction: AutobaseUpdateRepair;
  autobaseGetSetCar: GetCar;
  autobaseGetRepairCompany: GetRepairCompany;
  autobaseGetRepairType: GetRepairType;
};
export type OwnRepairProps = {
  element: Repair | null;
  handleHide: OnFormHideType
  car_id: number;
  page?: string;
  path?: string;
};

export type PropsRepairWithForm = (
  StatePropsRepair
  & DispatchPropsRepair
  & OwnRepairProps
);

export type PropsRepair = OutputWithFormProps<
  PropsRepairWithForm,
  Repair,
  [ Repair ],
  any
>;
export type StateRepair = {
  carListOptions: DefaultSelectListMapper<Car['asuods_id'], Car['gov_number'], Car>;
  repairCompanyOptions: DefaultSelectListMapper<RepairCompany['id'], RepairCompany['name'], RepairCompany>;
  repairTypeOptions: DefaultSelectListMapper<RepairType['id'], RepairType['name'], RepairType>;
  statusOptions: DefaultSelectListMapper<string, string, any>;
};
