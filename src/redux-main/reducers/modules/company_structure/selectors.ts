import { ReduxState } from 'redux-main/@types/state';
import { createSelector, Selector } from 'reselect';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';

// for reselect
export type CompanyStructureLinearStructure = ValuesOf<IStateCompanyStructure['companyStructureLinearList']>;

export type GetCompanyStructureLinearOptionsAns = (
  Array<DefaultSelectOption<CompanyStructureLinearStructure['id'], CompanyStructureLinearStructure['name'], CompanyStructureLinearStructure>>
);

export const getSomeUniqCompanyStructureLinear: Selector<ReduxState, IStateCompanyStructure['companyStructureLinearList']> = (state) => (
  getCompanyStructureState(state).companyStructureLinearList
);

export const getCompanyStructureLinearOptions = createSelector<ReduxState, IStateCompanyStructure['companyStructureLinearList'], GetCompanyStructureLinearOptionsAns>(
  getSomeUniqCompanyStructureLinear,
  (companyStructureList) => companyStructureList.map((companyStructure) => ({
    value: companyStructure.id,
    label: companyStructure.name,
    rowData: companyStructure,
  })),
);
