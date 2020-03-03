import { CompanyStructure, IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsCompanyStructure = {
  companyStructureLinearList: IStateCompanyStructure['companyStructureLinearList'];
};
export type OwnCompanyStructureProps = WithFormRegistrySearchAddProps<CompanyStructure>;

export type PropsCompanyStructureWithForm = (
  StatePropsCompanyStructure
  & OwnCompanyStructureProps
);

export type PropsCompanyStructure = OutputWithFormProps<
  PropsCompanyStructureWithForm,
  CompanyStructure,
  [ CompanyStructure ],
  any
>;
