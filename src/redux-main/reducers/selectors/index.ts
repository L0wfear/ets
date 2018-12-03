import { ReduxState } from 'redux-main/@types/state';

export type GetStateDataByKeyType = (state: ReduxState) => <K extends keyof ReduxState>(stateKey: K) => ReduxState[K];
export type GetStateType<K extends keyof ReduxState> = (state: ReduxState) => ReduxState[K];

export const getStateDataByKey: GetStateDataByKeyType = (state) => (stateKey) => state[stateKey];

export const getUserNotificationsState: GetStateType<'userNotifications'> = (state) => (
  getStateDataByKey(state)('userNotifications')
);
export const getDashboardState: GetStateType<'dashboard'> = (state) => (
  getStateDataByKey(state)('dashboard')
);
export const getRegistryState: GetStateType<'registry'> = (state) => (
  getStateDataByKey(state)('registry')
);
export const getReportState: GetStateType<'report'> = (state) => (
  getStateDataByKey(state)('report')
);
export const getOldReportState: GetStateType<'old_report'> = (state) => (
  getStateDataByKey(state)('old_report')
);
export const getsSssionState: GetStateType<'session'> = (state) => (
  getStateDataByKey(state)('session')
);
export const getAutobaseState: GetStateType<'autobase'> = (state) => (
  getStateDataByKey(state)('autobase')
);
export const getEmployeeState: GetStateType<'employee'> = (state) => (
  getStateDataByKey(state)('employee')
);
export const getMonitorPageState: GetStateType<'monitorPage'> = (state) => (
  getStateDataByKey(state)('monitorPage')
);
export const getLoadingState: GetStateType<'loading'> = (state) => (
  getStateDataByKey(state)('loading')
);
export const getEtsLoadingState: GetStateType<'etsLoading'> = (state) => (
  getStateDataByKey(state)('etsLoading')
);
export const getCompanyStructureState: GetStateType<'company_structure'> = (state) => (
  getStateDataByKey(state)('company_structure')
);
