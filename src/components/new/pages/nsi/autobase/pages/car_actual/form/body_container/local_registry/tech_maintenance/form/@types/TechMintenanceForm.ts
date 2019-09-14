import {
  TechMaintenance,
  IStateAutobase,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../../../@types/CarForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsTechMaintenance = {
  repairCompanyList: IStateAutobase['repairCompanyList'];
  techMaintOrderList: IStateAutobase['techMaintOrderList'];
};
export type OwnTechMaintenanceProps = WithFormRegistrySearchAddProps<TechMaintenance> & { selectedCarData?: CarWrap };

export type PropsTechMaintenanceWithForm = (
  StatePropsTechMaintenance
  & OwnTechMaintenanceProps
);

export type PropsTechMaintenance = OutputWithFormProps<
  PropsTechMaintenanceWithForm,
  TechMaintenance,
  [TechMaintenance],
  any
>;
