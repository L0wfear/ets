import { createSelector, Selector } from 'reselect';
import { get, find, keyBy } from 'lodash';

import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import {
  OneSessionCompany,
} from './@types/session';
import { DefaultSelectOption, DefaultSelectListMapper, defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { InitialStateSession, OneSessionStructure } from './@types/session';

export type fuelTypeStructure = {
  name: string;
  id: string;
};

export type GetSessionCompanyOptionsAns = (
  Array<DefaultSelectOption<OneSessionCompany['asuods_id'], OneSessionCompany['name'], OneSessionCompany>>
);

export const getSessionCompany: Selector<ReduxState, Array<OneSessionCompany>> = (state) => (
  getSessionState(state).userData.companies
);

export const getSessionCompanyIndex = createSelector(
  getSessionCompany,
  (companies) => keyBy(companies, 'asuods_id'),
);

export const getSessionCompanyOptions = createSelector<ReduxState, Array<OneSessionCompany>, GetSessionCompanyOptionsAns>(
  getSessionCompany,
  (companies) => companies.map((company) => ({
    value: company.asuods_id,
    label: company.name,
    rowData: company,
  })),
);

export type GetSessionFuelTypeOptionsAns = (
  Array<DefaultSelectOption<fuelTypeStructure['id'], fuelTypeStructure['name'], fuelTypeStructure>>
);
export const getSessionCompanyId: Selector<ReduxState, InitialStateSession['userData']['company_id']> = (state) => (
  getSessionState(state).userData.company_id
);

export const getSessionUserStructureId: Selector<ReduxState, InitialStateSession['userData']['structure_id']> = (state) => (
  getSessionState(state).userData.structure_id
);
export const getSessionUserStructureName: Selector<ReduxState, InitialStateSession['userData']['structure_name']> = (state) => (
  getSessionState(state).userData.structure_name
);
export const getSessionUserStructures: Selector<ReduxState, InitialStateSession['userData']['structures']> = (state) => (
  getSessionState(state).userData.structures
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

export type GetSessionStructuresOptionsAns = (
  DefaultSelectListMapper<OneSessionStructure>
);
const makeOptionFromStructures = (structures: InitialStateSession['userData']['structures']) => (
  structures
    .map(defaultSelectListMapper)
);

export const getSessionStructuresOptions = createSelector<ReduxState, InitialStateSession['userData']['structures'], ReturnType<typeof makeOptionFromStructures>>(
  getSessionUserStructures,
  makeOptionFromStructures,
);

const makeSessionStuctureParams = (
  structure_id: InitialStateSession['userData']['structure_id'],
  STRUCTURES: ReturnType<typeof makeOptionFromStructures>,
) => {
  let STRUCTURE_FIELD_VIEW = false;
  let STRUCTURE_FIELD_READONLY = false;
  let STRUCTURE_FIELD_DELETABLE = false;

  if (structure_id !== null && STRUCTURES.length === 1 && structure_id === STRUCTURES[0].value) { // когда пользователь привязан к конкретному подразделению
    STRUCTURE_FIELD_VIEW = true;
    STRUCTURE_FIELD_READONLY = true;
  } else if (structure_id !== null && STRUCTURES.length > 1 && find(STRUCTURES, (el) => el.value === structure_id)) {
    STRUCTURE_FIELD_VIEW = true;
  } else if (structure_id === null && STRUCTURES.length > 0) {
    STRUCTURE_FIELD_VIEW = true;
    STRUCTURE_FIELD_DELETABLE = true;
  }

  return {
    STRUCTURE_FIELD_VIEW,
    STRUCTURE_FIELD_READONLY,
    STRUCTURE_FIELD_DELETABLE,
  };
};

const makeSessionUsePouringState = (
  company_id: InitialStateSession['userData']['company_id'],
  COMPANIES: InitialStateSession['userData']['companies'],
) => {
  if (COMPANIES.length === 1 && company_id === COMPANIES[0].asuods_id) {
    return COMPANIES[0].use_pouring;
  } else if (COMPANIES.length > 1) {
    const company = find(COMPANIES, (el) => el.asuods_id === company_id);
    return get(company, 'use_pouring', null);
  }
};

export const getSessionUsePouring = createSelector<ReduxState, InitialStateSession['userData']['company_id'], InitialStateSession['userData']['companies'], ReturnType<typeof makeSessionUsePouringState>>(
  getSessionCompanyId,
  getSessionCompany,
  makeSessionUsePouringState,
);

export const getSessionStructuresParams = createSelector<ReduxState, InitialStateSession['userData']['structure_id'], GetSessionStructuresOptionsAns, ReturnType<typeof makeSessionStuctureParams>>(
  getSessionUserStructureId,
  getSessionStructuresOptions,
  makeSessionStuctureParams,
);
