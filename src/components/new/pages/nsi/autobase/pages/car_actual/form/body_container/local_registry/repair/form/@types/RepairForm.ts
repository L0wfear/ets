import {
  Repair,
  RepairCompany,
  RepairType,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import {
  DefaultSelectListMapper,
} from 'components/old/ui/input/ReactSelect/utils';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { CarWrap } from '../../../../../@types/CarForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsRepair = {
  userCompanyId: InitialStateSession['userData']['company_id'];
};

export type OwnRepairProps = WithFormRegistrySearchAddProps<Repair> & { selectedCarData?: CarWrap };

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
