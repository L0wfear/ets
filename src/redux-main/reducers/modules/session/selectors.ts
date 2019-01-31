import { createSelector, Selector } from 'reselect';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  OneSessionCompany,
} from './session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';

export type fuelTypeStructure = {
  name: string;
  id: string;
};

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

export type GetSessionFuelTypeOptionsAns = (
  DefaultSelectOption<fuelTypeStructure['id'], fuelTypeStructure['name'], fuelTypeStructure>[]
);

export const getSessionFuelType: Selector<ReduxState, object> = (state) => (
  getSessionState(state).appConfig.enums.FUEL_TYPE
);

export const getSessionFuelTypeOptions = createSelector<ReduxState, object, GetSessionFuelTypeOptionsAns>(
  getSessionFuelType,
  (FUEL_TYPE) => Object.keys(FUEL_TYPE).map((elem) => {
    return {
      value: elem,
      label: FUEL_TYPE[elem],
      rowData: {
        id: elem,
        name: FUEL_TYPE[elem],
      },
    };
  }),
);
