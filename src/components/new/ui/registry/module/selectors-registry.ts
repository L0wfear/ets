import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import registryDefaultObj from 'components/new/ui/registry/module/contant/defaultValues';

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

export const getServiceData: any = (registryState, registryKey) => (
  (registryState[registryKey] || registryDefaultObj).Service
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
