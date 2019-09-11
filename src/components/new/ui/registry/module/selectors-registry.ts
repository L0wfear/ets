import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import registryDefaultObj from 'components/new/ui/registry/module/contant/defaultValues';
import { createSelector } from 'reselect';
import { get } from 'lodash';
import { getRegistryState } from 'redux-main/reducers/selectors';

type getHeaderDataFunc = (
  registryState: ReduxState['registry'],
  registryKey: string,
) => OneRegistryData['header'];

type getListDataFunc = (
  registryState: ReduxState['registry'],
  registryKey: string,
) => OneRegistryData['list'];

type getFilterDataFunc = (
  registryState: ReduxState['registry'],
  registryKey: string,
) => OneRegistryData['filter'];

type getRootRegistryFunc = (
  registryState: ReduxState['registry'],
  registryKey: string,
  noTemplate?: boolean,
) => OneRegistryData;

export const getServiceData = (state: ReduxState, registryKey: string) => (
  (getRegistryState(state)[registryKey] || registryDefaultObj).Service
);

export const getHeaderData: getHeaderDataFunc = (registryState, registryKey) => (
  (registryState[registryKey] || registryDefaultObj).header
);

export const getListData: getListDataFunc = (registryState, registryKey) => (
  (registryState[registryKey] || registryDefaultObj).list
);

export const getFilterData: getFilterDataFunc = (registryState, registryKey) => (
  (registryState[registryKey] || registryDefaultObj).filter
);

export const getRootRegistry: getRootRegistryFunc = (registryState, registryKey, noTemplate) => (
  (registryState[registryKey] || (!noTemplate ? registryDefaultObj : null))
);

export const geProcessedArray = (state: ReduxState, registryKey: string) => (
  getListData(getRegistryState(state), registryKey).processed.processedArray
);

export const getPaginator = (state: ReduxState, registryKey: string) => (
  getListData(getRegistryState(state), registryKey).paginator
);

export const selectorShowArray = createSelector(
  geProcessedArray,
  getPaginator,
  getServiceData,
  (processedArray, paginator, Service) => {
    const {
      currentPage,
      perPage,
    } = paginator;
    const userServerFilters = get(Service, 'getRegistryData.userServerFilters', false);

    const currentPageEdit = userServerFilters ? 0 : currentPage;

    return processedArray.slice(currentPageEdit * perPage, (currentPageEdit + 1) * perPage);
  },
);
