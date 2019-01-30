import { createSelector, Selector } from 'reselect';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import { OneSessionCompany } from './session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type GetSessionCompanyOptionsAns = (
  DefaultSelectOption<OneSessionCompany['asuods_id'], OneSessionCompany['name'], OneSessionCompany>[]
);

export const getSessionCompany: Selector<ReduxState, OneSessionCompany[]> = (state) => (
  getSessionState(state).userData.companies
);

export const getSessionCompanyOptions = createSelector<ReduxState, OneSessionCompany[], GetSessionCompanyOptionsAns>(
  getSessionCompany,
  (companies) => companies.map((company) => ({
    value: company.asuods_id,
    label: company.name,
    rowData: company,
  })),
);
