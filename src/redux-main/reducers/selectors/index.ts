import { ReduxState } from 'redux-main/@types/state';

export {
  getInspect,
  getInspectAutobase,
  getInspectPgmBase,
  getInspectCarsCondition,
} from 'redux-main/reducers/modules/inspect/@selectors/inspect_selectors';

export const getUserNotificationsState = (state: ReduxState) => (
  state.userNotifications
);
export const getDashboardState = (state: ReduxState) => (
  state.dashboard
);
export const getRegistryState = (state: ReduxState) => (
  state.registry
);
export const getReportState = (state: ReduxState) => (
  state.report
);
export const getOldReportState = (state: ReduxState) => (
  state.old_report
);
export const getSessionState = (state: ReduxState) => (
  state.session
);
export const getAutobaseState = (state: ReduxState) => (
  state.autobase
);
export const getEmployeeState = (state: ReduxState) => (
  state.employee
);
export const getMonitorPageState = (state: ReduxState) => (
  state.monitorPage
);
export const getLoadingState = (state: ReduxState) => (
  state.loading
);
export const getEtsLoadingState = (state: ReduxState) => (
  state.etsLoading
);
export const getCompanyStructureState = (state: ReduxState) => (
  state.company_structure
);
export const getRoutesState = (state: ReduxState) => (
  state.routes
);
export const getSomeUniqState = (state: ReduxState) => (
  state.some_uniq
);
export const getGeoobjectState = (state: ReduxState) => (
  state.geoobject
);
export const getMissionsState = (state: ReduxState) => (
  state.missions
);
export const getCompanyState = (state: ReduxState) => (
  state.company
);
export const getFuelRatesState = (state: ReduxState) => (
  state.fuelRates
);
export const getMaintenanceRateState = (state: ReduxState) => (
  state.maintenanceRate
);
export const getMaterialConsumptionRateState = (state: ReduxState) => (
  state.materialConsumptionRate
);
export const getFormDataRecordState = (state: ReduxState) => (
  state.formDataRecord
);
